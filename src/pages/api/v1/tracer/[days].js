import path from 'path';
import getTracerAppData from '@functions/sources/tracerAppData';
import { getJson, saveJson } from '@functions/cacheHelper';
import { reply, CustomError } from '@functions/apiHelper';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/tracer/get.json');

async function get(days) {
    if (isNaN(days)) throw new CustomError(400, 'Parameter days must be a number');
    if (days === -1) days = Number.MAX_SAFE_INTEGER;

    const parsedJson = await getJson(CACHE_FILE);
    const cacheCheckedAt = new Date(parsedJson.checkedAt || 0);
    if (cacheCheckedAt.getTime() > Date.now() - 6000000) return formatResponse(parsedJson, days);

    const { updatedAt, days: list } = await getTracerAppData(days);

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt,
        list,
    };

    saveJson(CACHE_FILE, formattedJson);
    return { ...formatResponse(formattedJson, days), fromCache: false };
}

function formatResponse(data, days) {
    return {
        ...data,
        list: data.list.slice(Math.max(data.list.length - days, 0)).reverse(),
    };
}

/**
 * @api {GET} /v1/tracer/:days Tracer App Data
 * @apiName TracerData
 * @apiDescription Get the latest stats for the New Zealand COVID-19 Tracer App.
 * @apiGroup Tracer
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 * @apiUse V1FailureResponse
 * @apiParam {Number} days The number of past days to fetch.
 * For example, 7 will get the last 7 days. -1 will get all possible data.
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        const days = req.query?.days;
        if (req.method === 'GET')
            return get(+days)
                .then((data) => reply(req, res, data))
                .catch((err) => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}
