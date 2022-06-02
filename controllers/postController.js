const db = require('../models')
const jwtUtils = require('../utils/jwt')
const fs = require('fs')

const Post = db.posts
const User = db.users
    /*******************************************************
     **************  ADD POST  ******************
     ***************************************************** */
const addPost = (req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    const description = req.body.description
    const image = req.file.filename
    if (description === "") {
        res.status(404).json({ 'message': 'description is required' });
    }
    if (description.length < 100) {
        res.status(500).json({ 'message': 'description must be at least 100 characters' })
    }
    if (!image) {
        res.status(400).send({ 'message': 'Please upload a file.' })
    }

    Post.create({
        description: description,
        image: image,
        status: 0,
        UserId: userId,
    }).then((postMessage) => {
        console.log(postMessage)
        res.status(200).json({ 'message': 'Post created successfully' })
    }).catch((error) => {
        res.status(400).json({ 'error': error.message })
    })

}

/*******************************************************
 **************  LIST POST  ******************
 ***************************************************** */
const listPosts = async(req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    await Post.findAll({
        include: [{
            model: User,
            attributes: ['name', 'isAdmin'],
        }],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((posts) => {
        res.status(200).json(posts)
    }).catch((error) => {
        res.status(400).json(error.message)
    })

}


/*******************************************************
 **************  REMOVE POST  ******************
 ***************************************************** */
const removePost = async(req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    var idPost = req.params.id;
    if (!idPost) { return res.status(400).json({ 'message': 'Unknown post to delete' }); }
    console.log(req.params.id)
    await Post.findByPk(idPost)
        .then((post) => {
            if (post.UserId === userId) {
                fs.unlink('./public/images/' + post.image, (err) => {
                    if (err) res.status(500).send({ 'message': err });
                    post.destroy()
                        .then(function(deletedRecord) {
                            if (deletedRecord) {
                                res.status(200).json({ message: "Deleted successfully" });
                            } else {
                                res.status(404).json({ message: "record not found" })
                            }
                        })
                        .catch(function(error) {
                            res.status(500).json(error);
                        });
                })
            } else {
                res.status(403).json({ 'message': 'Law not allowed' });
            }
        }).catch((error) => {
            res.status(500).json({ 'message': error.message });
        })
}

/*******************************************************
 **************  BLOCKED POST  ******************
 ***************************************************** */

const blockedPost = (req, res) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth)
    if (userId < 0) {
        res.status(400).json({ 'message': 'wrong token' });
    }
    //user law
    User.findByPk(userId)
        .then((user) => {
            if (user.isAdmin === "moderator") {
                var idPost = req.params.id
                if (!idPost) { return res.status(400).json({ 'message': 'Unknown post to blocked' }); }
                Post.update({ status: 1 }, { where: { id: idPost } })
                    .then((post) => {
                        res.status(200).json({ 'message': 'Post blocked successfully' })
                    }).catch((error) => {
                        res.status(404).json({ 'message': error.message })
                    })
            } else {
                res.status("401").json({ 'message': 'Your are not allowed to block this post.' })
            }
        }).catch((error) => {
            res.status(error.status).json({ 'message': error.message })
        })



}

module.exports = {
    addPost,
    listPosts,
    removePost,
    blockedPost
}