module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'pomsclete',
    DB: 'node_saquelize_db',
    dialect: 'mysql',

    pool: {
        max: 5, //the maximum number of connections in the pool
        min: 0, //the minimum number of connections in the pool
        acquire: 30000, //La durée maximale, en millisecondes, pendant laquelle ce pool essaiera d'obtenir une connexion avant de générer une erreur
        idle: 10000 //Durée maximale, en millisecondes, pendant laquelle une connexion peut être inactive avant d'être libérée.
    }
}