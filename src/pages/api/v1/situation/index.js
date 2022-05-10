import path from 'path';
import getCurrentCases from '@functions/sources/currentCases';
import { reply } from '@functions/apiHelper';
import { getJson, saveJson } from '@functions/cacheHelper';
import { addCommas } from '@functions/formatValue';
import rateLimiter from '@middlewares/rateLimiter';
const CACHE_FILE = path.resolve('public/cache/situation/get.json');

async function get() {
    const parsedJson = await getJson(CACHE_FILE);
    const cacheCheckedAt = new Date(parsedJson.checkedAt || 0);
    if (cacheCheckedAt.getTime() > Date.now() - 600000) return parsedJson;

    const { checkedAt, updatedAt, outcomes, allByBoard } = await getCurrentCases();
    const totalBoard = allByBoard.find((b) => b.board === 'Total');

    const newActive = totalBoard.increase;
    const active = addCommas(totalBoard.active);
    const newRecovered = outcomes.recovered.change;
    const recovered = addCommas(totalBoard.recovered);
    const newDeceased = outcomes.deceased.change;
    const deceased = addCommas(totalBoard.deceased);

    let summaryText = `As of ${new Date(updatedAt).toLocaleString('en-NZ', {
        timeZone: 'Pacific/Auckland',
    })}, the Ministry of Health New Zealand reported in the past 24 hours;`;

    if (newActive > 0)
        summaryText += `\n - ${
            newActive === 1 ? '1 new case' : `${addCommas(newActive)} new cases`
        } of COVID-19, there are currently ${active} active cases in New Zealand.`;
    else if (active === '0')
        summaryText += '\n - No new cases of COVID-19, there are currently no active cases of COVID-19 in New Zealand.';
    else summaryText += `\n - No new cases of COVID-19, there is currently ${active} active cases in New Zealand.`;

    if (newRecovered > 0)
        summaryText += `\n - ${
            newRecovered === 1 ? '1 person has' : `${addCommas(newRecovered)} people have`
        } recovered from the virus, for a new total of ${recovered}.`;
    if (newDeceased > 0)
        summaryText += `\n - ${
            newDeceased === 1 ? '1 person has' : `${addCommas(newDeceased)} people have`
        } died from the virus, for a new total of ${deceased}.`;

    const data = { fromCache: true, checkedAt, updatedAt, summaryText };
    saveJson(CACHE_FILE, data);
    return { ...data, fromCache: false };
}

/**
 * @api {GET} /v1/situation Situation Summary
 * @apiDescription Gets a group of short summaries of the current situation relating to cases and lockdowns.
 * @apiName SituationSummary
 * @apiGroup Situation
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
