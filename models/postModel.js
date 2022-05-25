module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
        },

    });

    return Post
}