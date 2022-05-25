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
    }
}