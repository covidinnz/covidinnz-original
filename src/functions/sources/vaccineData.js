import fetch from 'node-fetch';
import httj from 'html-table-to-json';
import cheerio from 'cheerio';

import { parseDate } from '@functions/parseDate';
import { resolveValue, Ethnicities, Boards } from '@constants/units';

const SOURCE_URL =
    'https://www.health.govt.nz/our-work' +
    '/diseases-and-conditions/covid-19-novel-coronavirus' +
    '/covid-19-data-and-statistics/covid-19-vaccine-data';

export default async function () {
    const body = await fetch(SOURCE_URL).then((res) => res.text());
    const $ = cheerio.load(body);
    const tables = $('table');
    const ps = Array.from($('p'))
        .map((i) => i.children[0])
        .map((j) => (j.children?.length ? j.children[0] : j));

    const twelvePlusDoses = parseTwelvePlus(cheerio.html(tables[0]));
    const fiveToElevenDoses = parseFiveToEleven(cheerio.html(tables[1]));
    const allByEthnicity = parseByEthnicity(cheerio.html(tables[2]));
    const twelvePlusByBoard = parseTwelvePlusByBoard(cheerio.html(tables[3]));
    const fiveToElevenByBoard = parseFiveToElevenByBoard(cheerio.html(tables[4]));

    return {
        checkedAt: new Date(),
        updatedAt: parseDate(ps[2].data),
        twelvePlusDoses,
        fiveToElevenDoses,
        allByEthnicity,
        allByBoard: combineBoards(twelvePlusByBoard, fiveToElevenByBoard),
    };
}

export function combineBoards(twelvePlus, fiveToEleven) {
    return twelvePlus.map((tp) => {
        const fe = fiveToEleven.find((f) => f.id === tp.id);
        return {
            id: tp.id,
            board: tp.board,
            twelvePlus: {
                partially: tp.partially,
                partiallyPercent: tp.partiallyPercent,
                fully: tp.fully,
                fullyPercent: tp.fullyPercent,
                boosterEligible: tp.boosterEligible,
                booster: tp.booster,
                boosterPercent: tp.boosterPercent,
                population: tp.population,
            },
            fiveToEleven: {
                partially: fe.partially,
                partiallyPercent: fe.partiallyPercent,
                fully: fe.fully,
                fullyPercent: fe.fullyPercent,
                population: fe.population,
            },

            partially: tp.partially + fe.partially,
            partiallyPercent: Number.parseFloat(((tp.partiallyPercent + fe.partiallyPercent) / 2).toFixed(2)),
            fully: tp.fully + fe.fully,
            fullyPercent: Number.parseFloat(((tp.fullyPercent + fe.fullyPercent) / 2).toFixed(2)),
            booster: tp.booster,
            population: tp.population + fe.population,
        };
    });
}

const clean = (s) => +s.replace(/\*|,|%|\>/g, '') ?? null;

function parseTwelvePlus(html) {
    const [f, s, t, b, a] = httj.parse(html).results[0].map((i) => Object.values(i));
    return {
        first: {
            yesterday: clean(f[0]),
            total: clean(f[1]),
        },
        second: {
            yesterday: clean(s[0]),
            total: clean(s[1]),
        },
        third: {
            yesterday: clean(t[0]),
            total: clean(t[1]),
        },
        booster: {
            yesterday: clean(b[0]),
            total: clean(b[1]),
        },
        yesterday: clean(a[0]),
        total: clean(a[1]),
    };
}

function parseFiveToEleven(html) {
    const [f, s] = httj.parse(html).results[0].map((i) => Object.values(i));
    return {
        first: {
            yesterday: clean(f[0]),
            total: clean(f[1]),
        },
        second: {
            yesterday: clean(s[0]),
            total: clean(s[1]),
        },
        yesterday: clean(f[0]) + clean(s[0]),
        total: clean(f[1]) + clean(s[1]),
    };
}

function parseByEthnicity(html) {
    const parsed = httj.parse(html.replace(/th nowrap="nowrap"/g, 'td')).results[0].map((p) => Object.values(p));
    return parsed.map((p) => ({
        id: resolveValue(Ethnicities, p[0])?.id,
        ethnicity: resolveValue(Ethnicities, p[0])?.name,
        twelvePlus: {
            partially: clean(p[1]),
            fully: clean(p[2]),
            population: clean(p[3]),
            eighteenPlus: {
                bootser: clean(p[4]),
            },
        },
        fiveToEleven: {
            partially: clean(p[5]),
            fully: clean(p[6]),
            population: clean(p[7]),
        },

        partially: clean(p[1]) + clean(p[5]),
        fully: clean(p[2]) + clean(p[6]),
        booster: clean(p[4]),
        population: clean(p[3]) + clean(p[7]),
    }));
}

function parseTwelvePlusByBoard(html) {
    const parsed = httj.parse(html.replace(/th nowrap="nowrap"/g, 'td')).results[0].map((p) => Object.values(p));
    return parsed.map((p) => ({
        id: resolveValue(Boards, p[0])?.id,
        board: resolveValue(Boards, p[0])?.name,
        partially: clean(p[1]),
        partiallyPercent: clean(p[2]),
        fully: clean(p[3]),
        fullyPercent: clean(p[4]),
        population: clean(p[5]),
        boosterEligible: clean(p[6]),
        booster: clean(p[7]),
        boosterPercent: clean(p[8]),
    }));
}

function parseFiveToElevenByBoard(html) {
    const parsed = httj.parse(html.replace(/th nowrap="nowrap"/g, 'td')).results[0].map((p) => Object.values(p));
    return parsed.map((p) => ({
        id: resolveValue(Boards, p[0])?.id,
        board: resolveValue(Boards, p[0])?.name,
        partially: clean(p[1]),
        partiallyPercent: clean(p[2]),
        fully: clean(p[3]),
        fullyPercent: clean(p[4]),
        population: clean(p[5]),
    }));
}
