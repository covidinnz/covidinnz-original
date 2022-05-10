import getCurrentCases from '@functions/sources/currentCases';
import getCaseDemographics from '@functions/sources/caseDemographics';
import { reply, CustomError } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
import path from 'path';
const CACHE_FOLDER = path.resolve('public/cache/cases');

const SORT_TYPES_1 = ['source', 'board'];
const SORT_TYPES_2 = ['age', 'ethnicity', 'gender'];

async function by(sort) {
    sort = sort.toLowerCase();
    if (!SORT_TYPES_1.includes(sort) && !SORT_TYPES_2.includes(sort))
        throw new CustomError(400, 'Parameter sort is invalid');

    const filePath = path.resolve(CACHE_FOLDER, `by-${sort}.json`);
    const parsedJson = await getJson(filePath);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    let list = [],
        cacheUpdatedAt = new Date();
    if (SORT_TYPES_1.includes(sort)) {
        const { updatedAt, activeBySource, allByBoard } = await getCurrentCases();
        const lists = [activeBySource, allByBoard];
        list = lists[SORT_TYPES_1.indexOf(sort)];
        cacheUpdatedAt = new Date(updatedAt);
    } else if (SORT_TYPES_2.includes(sort)) {
        const { updatedAt, allByAge, allByEthnicity, allByGender } = await getCaseDemographics();
        const lists = [allByAge, allByEthnicity, allByGender];
        list = lists[SORT_TYPES_2.indexOf(sort)];
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
 * @api {GET} /v1/cases/by/:sort Sorted Cases
 * @apiName SingleSortedCases
 * @apiDescription Get cases by a single given sort.
 * @apiGroup Cases
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 * @apiUse V1FailureResponse
 * @apiParam {String='source'|'board'|'age'|'ethnicity'|'gender'} sort The sort type.
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        const sort = req.query?.sort;
        if (req.method === 'GET')
            return by(sort)
                .then((data) => reply(req, res, data))
                .catch((err) => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}
