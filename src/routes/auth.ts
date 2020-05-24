import { Router } from 'express';
import { getToken, getConnectionUrl, verifyToken } from '../auth/googleOAuth2'
import config from '../config'

const authRouter = Router();

authRouter.get('/token', async (req, res) => {
    const result = await getToken(String(req.query.code))
    res.status(201)
        .cookie('auth_token', result, {
            httpOnly: true,
            domain: config.COOKIE_DOMAIN
        })
    res.send();
});

authRouter.get('/login', (req, res) => {
    const connectionUrl = getConnectionUrl()
    res.redirect(connectionUrl);
});

export default authRouter;
