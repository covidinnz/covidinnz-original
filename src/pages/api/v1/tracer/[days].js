import path from 'path';
import getTracerAppData from '@functions/sources/tracerAppData';
import { getJson, saveJson } from '@functions/cacheHelper';
import { reply, CustomError, failure } from '@functions/apiHelper';
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
 * @apiDescription The COVID-19 Tracer App is no longer used,
 * therefore this endpoint is no longer available.
 * @apiGroup Tracer
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 * @apiUse V1FailureResponse
 * @apiParam {Number} days The COVID-19 Tracer App is no longer used,
 * therefore this endpoint is no longer available.
 * @apiDeprecated
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        const days = req.query?.days;
        if (req.method === 'GET') {
            const err = new CustomError(410, 'Tracer endpoints have been deprecated.');
            return reply(req, res, err);
        }
        // return get(+days)
        //     .then((data) => reply(req, res, data))
        //     .catch((err) => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}
