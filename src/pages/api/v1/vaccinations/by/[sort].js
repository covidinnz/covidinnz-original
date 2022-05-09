import getVaccineData from '@functions/sources/vaccineData';
import { reply, CustomError } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
import path from 'path';

const CACHE_FOLDER = path.resolve('public/cache/vaccinations');
const SORT_TYPES_1 = ['ethnicity', 'board'];

async function by(sort) {
    sort = sort.toLowerCase();
    if (!SORT_TYPES_1.includes(sort))
        throw new CustomError(400, 'Parameter sort is invalid');

    const filePath = path.resolve(CACHE_FOLDER, `by-${sort}.json`);
    const parsedJson = await getJson(filePath);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    let list = [], cacheUpdatedAt = new Date();
    if (SORT_TYPES_1.includes(sort)) {
        const { updatedAt, allByEthnicity, allByBoard } = await getVaccineData();
        const lists = [allByEthnicity, allByBoard];
        list = lists[SORT_TYPES_1.indexOf(sort)];
        cacheUpdatedAt = new Date(updatedAt);
    }

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt: cacheUpdatedAt,
        list,
    };

    saveJson(filePath, formattedJson);
    return { ...formattedJson, fromCache: false };
}


/**
 * @api {GET} /v1/vaccinations/by/:sort Vaccinations Sorted
 * @apiName SingleSortedVaccinations
 * @apiDescription Get vaccinations by a given sort.
 * @apiGroup Vaccinations
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 * @apiUse V1FailureResponse
 * @apiParam {String='ethnicity'|'board'} sort The sort to get the vaccinations by.
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        const sort = req.query?.sort;
        if (req.method === 'GET') return by(sort)
            .then(data => reply(req, res, data))
            .catch(err => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}
