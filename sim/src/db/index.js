const { MongoClient } = require('mongodb');
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
const client = new MongoClient(url)

var simulationsCollection_;

const initDatabaseConnection = async function() {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    simulationsCollection_ = database.collection('simulations');
}

const closeDatabaseConnection = async function() {
    await client.close()
};

const simulationsCollection = function() {
    return simulationsCollection_;
}

module.exports = {
    initDatabaseConnection,
    closeDatabaseConnection,
    simulationsCollection,
}
