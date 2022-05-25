const db = require('../models')
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.js')

// Create main model

const User = db.users

// Create

const addUser = async(req, res) => {

    let dataUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    const user = await User.create(dataUser)
    res.status(200).send(user)
    console.log(user)
}

const login = (req, res) => {
    var email = req.body.email
    var password = req.body.password
    if (email === "" || password === "") {
        res.status(401).json({ 'message': 'Email and password are required' })
    } else {
        User.findOne({ where: { email: email } })
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, (err, resEncryp) => {
                        if (resEncryp) {
                            return res.status(200).json({
                                'UserId': user.id,
                                'TOKEN': jwtUtils.generateTokenForUser(user)
                            })
                        } else {
                            res.status(401).json({ 'message': 'invalid password' })
                        }
                    })
                } else {
                    res.status(401).json({ 'message': 'User not found' })
                }
            })
            .catch((err) => { res.status(500).json({ 'message': 'unable to find user' }) })
    }
}

const getAllUsers = async(req, res) => {

}


module.exports = {
    addUser,
    login,
    getAllUsers
}