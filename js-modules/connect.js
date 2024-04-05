const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


module.exports = {
    client,
    MongoClient,
    ServerApiVersion,
    ObjectId,
    CommandStartedEvent
};

// module.exports = client;
