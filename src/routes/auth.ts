import { Router } from 'express';
import { getToken, getConnectionUrl, verifyToken } from '../services/googleOAuth2'
import config from '../config'

const authRouter = Router();

authRouter.get('/token', async (req, res) => {
    try {
        const result = await getToken(String(req.query.code))
        const { id_token, userId, name, exp } = result;
        res.status(201)
            .send({
                authToken: id_token,
                userId,
                userName: name,
                expires: exp
            })
    } catch (err) {
        res.status(401).send("Login failed");
    }
});

authRouter.get('/login', (req, res) => {
    const connectionUrl = getConnectionUrl()
    res.redirect(connectionUrl);
});

export default authRouter;
