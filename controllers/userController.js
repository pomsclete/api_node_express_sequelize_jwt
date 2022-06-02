const db = require('../models')
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.js')

/*******************************************************
 **************  CONST REGEX  ******************
 ***************************************************** */
//emailregex.com
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //regexlib.com
const pwdRegex = /^(?=.*\d).{4,8}$/
const nameRegex = /^\s*[a-zA-Z,\s]+\s*$/

/*******************************************************
 **************  CONST MODEL DATA  ******************
 ***************************************************** */
const User = db.users

/*******************************************************
 **************  ADD USER  ******************
 ***************************************************** */

const addUser = (req, res) => {

    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    if (email === "" || password === "" || name === "") {
        res.status(400).json({ 'message': 'All input required' })
    } else if (name.length < 5) {
        res.status(400).json({ 'message': 'wrong name (must be at least 5 characters)' })
    } else if (!nameRegex.test(name)) {
        res.status(400).json({ 'message': 'Incorect name' })
    } else if (!emailRegex.test(email)) {
        res.status(400).json({ 'message': 'email is not a valid email' })
    } else if (!pwdRegex.test(password)) {
        res.status(400).json({ 'message': 'password invalid (must lenght 4 - 8 and include 1 number at least)' })
    } else {
        User.findOne({ where: { email: email } })
            .then((userFounded) => {
                if (userFounded) {
                    res.status(400).json({ 'message': 'Email already exists' })
                } else {
                    let dataUser = {
                        name: name,
                        email: email,
                        password: password
                    }
                    const user = User.create(dataUser)
                        .then(() => {
                            res.status(200).json({ 'message': 'Account created successfully' })
                        }).catch((err) => {
                            res.status(400).json({ 'message': err.message })
                        })
                    res.status(200).send(user)
                }

            })

    }

}

/*******************************************************
 **************  LOGIN  ******************
 ***************************************************** */
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
            .catch((err) => { res.status(400).json({ 'message': err.message }) })
    }
}

/*******************************************************
 **************  GET PROFIL USER INFO  ******************
 ***************************************************** */

const getUserProfile = (req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    User.findOne({
            attributes: ['id', 'name', 'email', 'isAdmin'],
            where: { id: userId }
        })
        .then((user) => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ 'message': 'user not found' })
            }
        })
        .catch((err) => {
            res.status(500).json({ 'message': err.message })
        })
}

/*******************************************************
 **************  EDIT PROFIL USER  ******************
 ***************************************************** */

const editProfil = (req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    var name = req.body.name
    var email = req.body.email
    if (email === "" || name === "") {
        res.status(403).json({ 'message': 'All fields required' });
    }
    if (!emailRegex.test(email)) {
        res.status(403).json({ 'message': 'invalid email' });
    }
    if (!nameRegex.test(name)) {
        res.status(403).json({ 'message': 'invalid name' });
    }

    User.findOne({
            where: { id: userId }
        })
        .then((user) => {
            if (user) {
                user.update({
                    name: name,
                    email: email
                }).then((userUpdate) => {
                    res.status(200).json(userUpdate)
                }).catch((error) => {
                    res.status(400).json({ 'message': error.message })
                })
            } else {
                res.status(404).json({ 'message': 'user not found' })
            }
        })
        .catch((err) => {
            res.status(400).json({ 'message': err.message })
        })
}

/*******************************************************
 **************  EDIT PASSWORD  ******************
 ***************************************************** */

const updatePwd = (req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    var oldPassword = req.body.oldPassword
    var newPassword = req.body.newPassword
    var confirmPassword = req.body.confirmPassword
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
        res.status(401).json({ 'message': 'all fields required' })
    }

    if (!pwdRegex.test(newPassword)) {
        res.status(401).json({ 'message': 'New password invalid (must lenght 4 - 8 and include 1 number at least' })
    }

    if (newPassword !== confirmPassword) {
        res.status(200).json({ 'message': 'new and old password is not matched' })
    }

    User.findOne({ where: { id: userId } })
        .then((user) => {
            if (!user) {
                res.status(404).json({ 'message': 'Password not found' })
            } else {
                bcrypt.compare(oldPassword, user.password, (err, resEncryp) => {
                    if (resEncryp) {
                        user.update({ password: newPassword })
                            .then((userPwdEdit) => {
                                res.status(200).json({ 'message': 'Password updated' })
                            })
                            .catch((err) => {
                                res.status(500).json(err)
                            })
                    } else {
                        res.status(401).json({ 'message': 'OldPassword not found' })
                    }
                })
            }
        }).catch((err) => {
            res.status(400).json({ 'message': err.message })
        })

}

/*******************************************************
 **************  GET ALL USER  ******************
 ***************************************************** */

const getAllUsers = async(req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    User.findOne({
            attributes: ['isAdmin'],
            where: { id: userId }
        })
        .then((user) => {
            if (user) {
                if (user.isAdmin == "admin") {
                    User.findAll({
                            attributes: ['id', 'name', 'email', 'isAdmin'],
                        })
                        .then((userAll) => {
                            res.status(200).json(userAll);
                        })
                        .catch((err) => {
                            res.status(500).json({ 'message': 'connot fetch user' })
                        })
                } else {
                    res.status(403).send({ 'message': "Access denied" });
                }
            } else {
                res.status(404).json({ 'message': 'user not found' })
            }
        })
        .catch((err) => {
            res.status(500).json({ 'message': 'connot fetch user' })
        })

}


module.exports = {
    addUser,
    login,
    getAllUsers,
    getUserProfile,
    editProfil,
    updatePwd
}