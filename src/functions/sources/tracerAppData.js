import fetch from 'node-fetch';
import papa from 'papaparse';
import cheerio from 'cheerio';

const clean = s => +s.replace(/\*|,|%/g, '') ?? null;
import { parseDate } from '@functions/parseDate';
const SOURCE_URL = 'https://www.health.govt.nz/our-work' +
    '/diseases-and-conditions/covid-19-novel-coronavirus' +
    '/covid-19-data-and-statistics/covid-19-nz-covid-tracer-app-data';

export default async function () {
    const body = await fetch(SOURCE_URL).then(res => res.text());
    const $ = cheerio.load(body);
    const csvUrl = 'https://www.health.govt.nz' + Array.from($('a'))
        .find(a => a.attribs.href?.includes('csv')).attribs.href;

    const csvData = await fetch(csvUrl).then(res => res.text());
    const parsedCsv = await papa.parse(csvData).data.filter(a => !!a[0]);

    return {
        checkedAt: new Date(),
        updatedAt: parseDate(csvUrl),
        days: formatDays(parsedCsv),
    };
}

function formatDays(items) {
    return items.map(([f, t, ap, qr, nzbn, sc, me, ad, ba]) => ({
        from: parseDate(f),
        to: parseDate(t),
        appRegistrations: clean(ap),
        qrCodesGenerated: clean(qr),
        nzbnRegisteredBusinesses: clean(nzbn),
        scans: clean(sc),
        manualEntries: clean(me),
        activeDevices: clean(ad),
        bluetoothActive24hr: clean(ba),
    }));
}