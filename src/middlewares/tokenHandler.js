// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// function tokenHandler(err, res, req, next) {
//     const authorizationHeader = req.header['authorization'];
//     if (!authorizationHeader) {
//         res.status(401).json(
//             `Cannot proceed because authentication header is undefined !`
//         );
//     }

//     console.log(authorizationHeader);

//     const token = authorizationHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             res.status(403).json(
//                 `Cannot proceed because access token is invalid ! !`
//             );
//             // return res.sendStatus(403);
//         }
//         console.log(decoded);

//         // req.user = decoded.username
//         next();
//     });
// }

// export default tokenHandler;

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
        next();
    });
}

export default tokenHandler;
