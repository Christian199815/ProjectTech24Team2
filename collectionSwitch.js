function moveObjects(username, desCollection, callback) {
    const db = client.db("Communities");
    const sourceCollection = db.collection('general');
    const destinationCollection = db.collection('desCollection');

    // Query documents to move from source collection
    sourceCollection.find({ username: username }).toArray((err, docs) => {
      if (err) {
        return callback(err);
      }

      // Insert documents into destination collection
      destinationCollection.insertMany(docs, (err, result) => {
        if (err) {
          return callback(err);
        }

        // Optionally, remove documents from source collection
        // sourceCollection.deleteMany({ username: username }, (err, result) => {
        //   if (err) {
        //     return callback(err);
        //   }

        //   callback(null, 'Objects moved successfully');
        // });
      });
    });
  }

  module.exports = {
    moveObjects
  };