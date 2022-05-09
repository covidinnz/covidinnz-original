import getVaccineData from '@functions/sources/vaccineData';
import { reply } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/vaccinations/all.json');
import path from 'path';

async function all() {
    const parsedJson = await getJson(CACHE_FILE);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    const { updatedAt, allByEthnicity, allByBoard } = await getVaccineData();

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt,

        board: allByBoard,
        ethnicity: allByEthnicity,
    };

    saveJson(CACHE_FILE, formattedJson);
    return { ...formattedJson, fromCache: false };
}

/**
 * @api {GET} /v1/vaccinations/by/all Vaccinations Sorted (All)
 * @apiName AllSortedVaccinations
 * @apiDescription Get all the vaccinations by all sorts.
 * @apiGroup Vaccinations
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        if (req.method === 'GET') return all()
            .then(data => reply(req, res, data))
            .catch(err => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}