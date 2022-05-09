import getVaccineData from '@functions/sources/vaccineData';
import { reply } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/vaccinations/get.json');
import path from 'path';

async function get() {
    const parsedJson = await getJson(CACHE_FILE);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    const { updatedAt, twelvePlusDoses, fiveToElevenDoses } = await getVaccineData();

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt,

        doses: {
            total: twelvePlusDoses.total + fiveToElevenDoses.total,
            yesterday: twelvePlusDoses.yesterday + fiveToElevenDoses.yesterday,

            twelvePlus: twelvePlusDoses,
            fiveToEleven: fiveToElevenDoses,
        },
    };

    saveJson(CACHE_FILE, formattedJson);
    return { ...formattedJson, fromCache: false };
}

/**
 * @api {GET} /v1/vaccinations Vaccination Rates
 * @apiName ImportantVaccinations
 * @apiDescription Get the most important information about the COVID-19 vaccination rates in New Zealand.
 * @apiGroup Vaccinations
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        if (req.method === 'GET') return get()
            .then(data => reply(req, res, data))
            .catch(err => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}