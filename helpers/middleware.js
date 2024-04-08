const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401).json('Token was null');
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error(err);
            return res.status(403).json('Token authentication failed');
        } else {
            next();
        }
    });
};

module.exports = {
    authenticateToken,
};
