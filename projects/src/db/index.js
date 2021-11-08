const { MongoClient } = require('mongodb');
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
const client = new MongoClient(url)

var projectsCollection_;
var librariesCollection_;

const initDatabaseConnection = async function() {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    projectsCollection_ = database.collection('projects');
    librariesCollection_ = database.collection('libraries');
}

const closeDatabaseConnection = async function() {
    await client.close()
};

const projectsCollection = function() {
    return projectsCollection_;
}

const librariesCollection = function() {
    return librariesCollection_;
}

module.exports = {
    initDatabaseConnection,
    closeDatabaseConnection,
    projectsCollection,
    librariesCollection,
}
