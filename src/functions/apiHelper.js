import http from 'http';

export class CustomError extends Error {
    constructor(code, details) {
        super(http.STATUS_CODES[code]);
        this.code = code;
        this.details = details;
    }
}

export function success(data) {
    return { sucess: true, data };
}

export function failure(code, details) {
    const error = { code, message: http.STATUS_CODES[code], details };
    return { sucess: false, error };
}

export function logger(req) {
    const at = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.indexOf(':') !== -1) ip = 'localhost';
    const { method, url } = req;
    console.log(`${ip} - [${at}] - ${method} ${url}`);
}

export function error(err, req) {
    const at = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip.indexOf(':') !== -1) ip = 'localhost';
    const { method, url } = req;
    console.error(`${ip} - [${at}] - ${method} ${url} ${err}`);
}

export function reply(req, res, data) {
    let [code, message] = [500, failure(500, 'An internal server error has occurred')];
    if (data instanceof CustomError) [code, message] = [data.code, failure(data.code, data.details)];
    else if (!(data instanceof Error)) [code, message] = [200, success(data)];

    if (data instanceof Error) error(data, req);
    else logger(req);

    let method = 'json';
    data = message;
    return res.status(code)[method](data);
}

reply.invalidMethod = function (req, res, methods) {
    const err = new CustomError(405, 'Method must be one of: ' + methods);
    return reply(req, res, err);
};
