import getCurrentCases from '@functions/sources/currentCases';
import getCaseDemographics from '@functions/sources/caseDemographics';
import { reply } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/cases/all.json');
import path from 'path';

async function all() {
    const parsedJson = await getJson(CACHE_FILE);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    const { updatedAt, activeBySource, allByBoard } = await getCurrentCases();
    const { allByAge, allByEthnicity, allByGender } = await getCaseDemographics();

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt,

        board: allByBoard,
        age: allByAge,
        ethnicity: allByEthnicity,
        gender: allByGender,

        active: {
            source: activeBySource,
        }
    }

    saveJson(CACHE_FILE, formattedJson);
    return { ...formattedJson, fromCache: false };
}

/**
 * @api {GET} /v1/cases/by/all Sorted Cases (All)
 * @apiName AllSortedCases
 * @apiDescription All cases sorted by all types.
 * @apiGroup Cases
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
