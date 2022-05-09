import { reply, CustomError } from '@functions/apiHelper';
import rateLimiter from '@middlewares/rateLimiter';

export default function handler(req, res) {
    return rateLimiter(req, res, () => {
        const err = new CustomError(404, 'Route not found on server');
        return reply(req, res, err);
    });
}

/**
 * @apiDefine V1SuccessResponse
 * @apiSuccess (200) {Boolean} success Whether or not the request was successful.
 * @apiSuccess (200) {Object} data The payload of data that was requested.
 */

/**
 * @apiDefine V1FailureResponse
 * @apiError {Boolean} success Whether or not the request was a success.
 * @apiError {Object} error The error object, containing the code, message and details.
 */