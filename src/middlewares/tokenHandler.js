import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function tokenHandler(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.status(401).json({
            message:
                'Cannot proceed because authentication header is undefined!',
        });
    }

    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Cannot proceed because access token is invalid !',
            });
        }
        req.id = decoded.id;
        next();
    });
}

export default tokenHandler;
