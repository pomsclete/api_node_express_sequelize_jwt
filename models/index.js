const dbConfig = require('../config/dbConfig.js')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connected to database')
    })
    .catch(err => {
        console.log('Error : ' + err)
    })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel.js')(sequelize, DataTypes)
db.posts = require('./postModel.js')(sequelize, DataTypes)
db.comments = require('./commentModel.js')(sequelize, DataTypes)
db.likes = require('./likeModel.js')(sequelize, DataTypes)


//ASSOCIATION TABLES

//Table posts et Table users

db.users.hasMany(db.posts, { as: "posts", onDelete: "CASCADE" }); // un utilisateur a plusieurs posts
// Si on supprime un user, on supprime ses posts //
db.posts.belongsTo(db.users);

//Tables intermédiaires likes
// un utilisateur a plusieurs likes
db.users.hasMany(db.likes, { as: "likes", onDelete: "CASCADE" }); // Si on supprime un user, on supprime ses messages //

db.likes.belongsTo(db.users);

//Tables intermédiaires likes
db.posts.hasMany(db.likes, { as: "likes", onDelete: "CASCADE" }); // Si on supprime un user, on supprime ses messages //
//posts a plusieurs likes
db.likes.belongsTo(db.posts);

//Table comment et user
db.users.hasMany(db.comments, { as: "comments", onDelete: "CASCADE" }); // Si on supprime un user, on supprime ses messages //
// un utilisateur a plusieurs commentaires
db.comments.belongsTo(db.users);

// Table comment et posts
db.posts.hasMany(db.comments, { as: "comments", onDelete: "CASCADE" }); // Si on supprime un post, on supprime ses messages //
//un post a plusieurs commentaires
db.comments.belongsTo(db.posts);



db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Ok resync is done')
    })



module.exports = db