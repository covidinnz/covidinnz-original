import NextCors from 'nextjs-cors';
import { failure } from '@functions/apiHelper';

const interval = 60000;
const limit = 60;
let store = {};
let nextReset = Date.now() + interval;

const getNextReset = () => nextReset - Date.now();
const resetAll = () => (store = {}) && (nextReset = Date.now() + interval);
const resetInterval = setInterval(resetAll, interval);

export default async function (req, res, next) {
    await NextCors(req, res, { origin: '*' });

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.indexOf(':') !== -1) ip = 'localhost';

    if (!store[ip]) store[ip] = 1;
    else store[ip]++;

    const rate = {
        limit: limit,
        current: store[ip],
        remaining: Math.max(limit - store[ip], 0),
        resetTime: Math.floor(getNextReset() / 1000),
    };

    res.setHeader('X-RateLimit-Limit', rate.limit);
    res.setHeader('X-RateLimit-Remaining', rate.remaining);
    res.setHeader('X-RateLimit-Reset', rate.resetTime);

    if (rate.current > rate.limit) {
        res.setHeader('Retry-After', Math.ceil((rate.resetTime - Date.now()) / 1000));
        return res.status(429).json(failure(429, 'Too many requests, please try again later'));
    }

    return next();
}
