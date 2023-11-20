const { MongoClient } = require('mongodb');
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
const client = new MongoClient(url)

var templatesCollection_;

const initDatabaseConnection = async function() {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    templatesCollection_ = database.collection('templates');
}

const closeDatabaseConnection = async function() {
    await client.close()
};

const templatesCollection = function() {
    return templatesCollection_;
}

module.exports = {
    initDatabaseConnection,
    closeDatabaseConnection,
    templatesCollection,
}
