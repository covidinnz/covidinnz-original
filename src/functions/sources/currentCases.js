import fetch from 'node-fetch';
import httj from 'html-table-to-json';
import cheerio from 'cheerio';

import { parseDate } from '@functions/parseDate';
import { resolveValue, CountTypes, ActiveSources, Boards } from '@constants/units';

const SOURCE_URL =
    'https://www.health.govt.nz/our-work' +
    '/diseases-and-conditions/covid-19-novel-coronavirus' +
    '/covid-19-data-and-statistics/covid-19-current-cases';

export default async function () {
    const body = await fetch(SOURCE_URL).then((res) => res.text());
    const $ = cheerio.load(body);
    const tables = $('table');
    const ps = Array.from($('p'))
        .map((i) => i.children[0])
        .map((j) => (j.children?.length ? j.children[0] : j));

    const summary = parseSummary(cheerio.html(tables[0]));
    const outcomes = parseOutcomes(cheerio.html(tables[1]));
    const activeByCount = parseActiveByCount(cheerio.html(tables[3]));
    const allByBoard = parseAllByBoard(cheerio.html(tables[5]));

    return {
        checkedAt: new Date(),
        updatedAt: parseDate(ps[1].data),
        summary,
        outcomes,
        activeByCount,
        allByBoard,
    };
}

const clean = (s) => +s?.replace(/\*|,|%/g, '') ?? null;

function parseSummary(html) {
    const parsed = httj.parse(html).results[0].map((p) => Object.values(p)[0]);
    return {
        newCases: clean(parsed[0]),
        newReinfections: clean(parsed[1]),
        totalCases: clean(parsed[3]),
        totalReinfections: clean(parsed[4]),
    };
}

function parseOutcomes(html) {
    const [a, r, d] = httj.parse(html).results[0].map((p) => Object.values(p));
    return {
        active: { change: clean(a[0]), total: clean(a[1]) },
        recovered: { change: clean(r[0]), total: clean(r[1]) },
        deceased: { change: clean(d[0]), total: clean(d[1]) },
    };
}

function parseActiveByCount(html) {
    const parsed = httj
        .parse(html.replace('&#xA0;', 'Type').replace(/th scope="row"/g, 'td'))
        .results[0].map((p) => Object.values(p));
    return parsed.map((t) => ({
        id: resolveValue(CountTypes, t[0])?.id,
        type: resolveValue(CountTypes, t[0])?.name,
        change: clean(t[1]),
        now: clean(t[2]),
        total: clean(t[3]),
    }));
}

function parseAllByBoard(html) {
    const parsed = httj
        .parse(html.replace('&#xA0;', 'Board').replace(/th scope="row"/g, 'td'))
        .results[0].map((p) => Object.values(p));
    console.log(parsed);
    return parsed.map((l) => ({
        id: resolveValue(Boards, l[0])?.id,
        board: resolveValue(Boards, l[0])?.name,
        active: clean(l[1]),
        recovered: clean(l[2]),
        deceased: clean(l[3]),
        total: clean(l[4]),
        increase: clean(l[5]),
    }));
}
