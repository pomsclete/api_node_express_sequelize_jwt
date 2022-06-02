const res = require('express/lib/response')
const jwt = require('jsonwebtoken')

const JWT_KEY_SECRET = '$2a$10$MKnXts7ZrWE34idPrbMtLe5LmD1aBYW.afzU2VHTmwaDq674S'

module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
                userId: userData.id,
                isAdmin: userData.isAdmin
            },
            JWT_KEY_SECRET, {
                expiresIn: '1h'
            }
        )
    },
    parseAuthorization: (authorization) => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null
    },
    getUserId: (authorization) => {
        var userId = -1
        var token = module.exports.parseAuthorization(authorization)
        if (!token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_KEY_SECRET)
                if (jwtToken != null) {
                    userId = jwtToken.userId
                }
            } catch (error) {
                res.status(400).json({ 'message': 'invalid jwt token' })
            }
        }
        return userId
    }
}