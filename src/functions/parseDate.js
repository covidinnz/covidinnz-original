import moment from 'moment';

const YYYY_MM_DD = /(\d{4})(?:\/|-|\.)(\d{1,2})(?:\/|-|\.)(\d{1,2})/gi;
const DD_MM_YYYY = /(\d{1,2})(?:\/|-|\.)(\d{1,2})(?:\/|-|\.)(\d{4})/gi;
const DD_MMMM_YYYY = /(\d{1,2}) ([a-z]{3,9}) (\d{2,4})/gi;

export function convertDate(input) {
    const [y, m, d] = [input.match(YYYY_MM_DD), input.match(DD_MMMM_YYYY), input.match(DD_MM_YYYY)];
    const date = y ? y[0] : m ? m[0] : d ? d[0] : null;
    if (!date) return null;

    let i = null;
    if (!!date.match(YYYY_MM_DD)) i = moment(input, ['YYYYMMDD']);
    else if (!!date.match(DD_MM_YYYY)) i = moment(input, ['DDMMYYYY']);
    else if (!!date.match(DD_MMMM_YYYY)) i = moment(new Date(date));
    return i.format('YYYY-MM-DD');
}

const HH_MM_SS_A = /(\d{1,2}):(\d{1,2}):(\d{1,2})( ?[ap]m)/;
const HH_MM_SS = /(\d{1,2}):(\d{1,2}):(\d{1,2})/gi;
const HH_MM_A = /(\d{1,2}):?(\d{1,2})?( ?[ap]m)/gi;
const HH_MM = /(\d{1,2}):(\d{1,2})/gi;

export function convertTime(input) {
    const [hmsa, hms, hm, hma] = [
        input.match(HH_MM_SS_A),
        input.match(HH_MM_SS),
        input.match(HH_MM),
        input.match(HH_MM_A),
    ];
    const time = hmsa ? hmsa[0] : hms ? hms[0] : hma ? hma[0] : hm ? hm[0] : null;
    if (!time) return null;
    return moment(time, ['HH:mm:ssA']).format('HH:mm:ss');
}

export function parseDate(input) {
    const date = input ? convertDate(input) : null;
    const time = input ? convertTime(input) : null;
    return new Date(date + (time?.match(HH_MM_SS) ? `T${time}.000` : ''));
}

export function toNewZealandTime(date) {
    return new Date(date.toString()).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });
}

export function formatTime(time) {
    return moment('2000-01-01T' + time).format('hh:mm a');
}

export function formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
}
