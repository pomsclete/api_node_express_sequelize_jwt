const postController = require('../controllers/postController')
const multer = require('multer');
const path = require('path');
const router = require('express').Router()


const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

router.post("/createPost", upload.single('image'), postController.addPost)
router.get("/listPosts", postController.listPosts)
router.delete("/deletePost/:id", postController.removePost)
router.get("/blockPost/:id", postController.blockedPost)

module.exports = router