import fetch from 'node-fetch';
import httj from 'html-table-to-json';
import cheerio from 'cheerio';

import { parseDate } from '@functions/parseDate';
import { resolveValue, Ethnicities, AgeGroups, Genders } from '@constants/units';

const SOURCE_URL = 'https://www.health.govt.nz/our-work' +
    '/diseases-and-conditions/covid-19-novel-coronavirus' +
    '/covid-19-data-and-statistics/covid-19-case-demographics';

export default async function () {
    const body = await fetch(SOURCE_URL).then(res => res.text());
    const $ = cheerio.load(body);
    const tables = $('table');
    const ps = Array.from($('p'))
        .map(i => i.children[0])
        .map(j => j.children?.length ? j.children[0] : j);

    const allByEthnicity = parseByEthnicity(cheerio.html(tables[5]));
    const allByAge = parseByAge(cheerio.html(tables[6]));
    const allByGender = parseBySex(cheerio.html(tables[7]));

    return {
        checkedAt: new Date(),
        updatedAt: parseDate(ps[1].data),
        allByEthnicity,
        allByAge,
        allByGender,
    };
}

const clean = s => +s.replace(/\*|,|%/g, '') ?? null;

function parseByEthnicity(html) {
    const parsed = httj.parse(html
        .replace(/th scope="row"/g, 'td'))
        .results[0].map(p => Object.values(p)).slice(1);
    return parsed.map(p => ({
        ethnicity: resolveValue(Ethnicities, p[1])?.name,
        id: resolveValue(Ethnicities, p[1])?.id,
        active: clean(p[2]),
        recovered: clean(p[3]),
        deceased: clean(p[4]),
        total: clean(p[5]),
        percent: clean(p[0]),
    }))
}

function parseByAge(html) {
    const parsed = httj.parse(html
        .replace(/th scope="row"/g, 'td'))
        .results[0].map(p => Object.values(p)).slice(1);
    return parsed.map(p => ({
        age: resolveValue(AgeGroups, p[1])?.name,
        id: resolveValue(AgeGroups, p[1])?.id,
        active: clean(p[2]),
        recovered: clean(p[3]),
        deceased: clean(p[4]),
        total: clean(p[5]),
        percent: clean(p[0]),
    }));
}

function parseBySex(html) {
    const parsed = httj.parse(html
        .replace(/th scope="row"/g, 'td'))
        .results[0].map(p => Object.values(p)).slice(1);
    return parsed.map(p => ({
        gender: resolveValue(Genders, p[1])?.name,
        id: resolveValue(Genders, p[1])?.id,
        active: clean(p[2]),
        recovered: clean(p[3]),
        deceased: clean(p[4]),
        total: clean(p[5]),
        percent: clean(p[0]),
    }));
}
