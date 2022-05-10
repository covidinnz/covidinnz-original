import { reply, CustomError } from '@functions/apiHelper';
import rateLimiter from '@middlewares/rateLimiter';

export default function handler(req, res) {
    return rateLimiter(req, res, () => {
        const err = new CustomError(404, 'Version not found on server');
        return reply(req, res, err);
    });
}
