import getCurrentCases from '@functions/sources/currentCases';
import { reply } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/cases/get.json');
import path from 'path';

async function get() {
    const parsedJson = await getJson(CACHE_FILE);
    const checkedAt = new Date(parsedJson.checkedAt || 0);
    if (checkedAt.getTime() > Date.now() - 600000) return parsedJson;

    const { updatedAt, summary, outcomes, activeByCount, allByBoard } = await getCurrentCases();
    const totalBoard = allByBoard.find((b) => b.board === 'Total');
    const activeCounts = [
        activeByCount.find((c) => c.id === 1),
        activeByCount.find((c) => c.id === 2),
        activeByCount.find((c) => c.id === -1),
    ];

    const formattedJson = {
        fromCache: true,
        checkedAt: new Date(),
        updatedAt,

        total: totalBoard.total,
        active: totalBoard.active,
        recovered: totalBoard.recovered,
        deceased: totalBoard.deceased,

        change: {
            active: outcomes.active.change,
            recovered: outcomes.recovered.change,
            deceased: outcomes.deceased.change,
        },

        current: {
            ...summary,

            confirmed: {
                total: activeCounts[0].total,
                now: activeCounts[0].now,
                change: activeCounts[0].change,
            },

            probable: {
                total: activeCounts[1].total,
                now: activeCounts[1].now,
                change: activeCounts[1].change,
            },
        },

        outcomes,
    };

    saveJson(CACHE_FILE, formattedJson);
    return { ...formattedJson, fromCache: true };
}

/**
 * @api {GET} /v1/cases Important Case Information
 * @apiName ImportantCases
 * @apiDescription The most important information about the COVID-19 cases in New Zealand.
 * @apiGroup Cases
 * @apiVersion 1.0.0
 * @apiUse V1SuccessResponse
 */
export default async function handler(req, res) {
    return rateLimiter(req, res, () => {
        if (req.method === 'GET')
            return get()
                .then((data) => reply(req, res, data))
                .catch((err) => reply(req, res, err));
        else return reply.invalidMethod(req, res, 'GET');
    });
}
