const { MongoClient } = require('mongodb');
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
const client = new MongoClient(url)

var devicesCollection_;

const initDatabaseConnection = async function() {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    devicesCollection_ = database.collection('devices');
    await devicesCollection_.updateMany({}, {
        $set: {
            online: false,
            socketId: '',
            ip: '',
        }
    })
}

const closeDatabaseConnection = async function() {
    await client.close()
};

const devicesCollection = function() {
    return devicesCollection_;
}

module.exports = {
    initDatabaseConnection,
    closeDatabaseConnection,
    devicesCollection,
}
