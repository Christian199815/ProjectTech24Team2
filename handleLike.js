const {client} = require("./connect");



const handleLikeUnlike = async (req, res, itemKey, action) => {
    const database = client.db("Communities");
    const users = database.collection("general");
    const user = await users.findOne({ username: req.session.user });
    const itemID = req.body[action + '_button']; // Dynamically access like/unlike button based on action
  
    try {
      const update = action === 'like' ? { $push: { [itemKey]: itemID } } : { $pull: { [itemKey]: itemID } };
      const result = await users.updateOne(
        { _id: user._id },
        update
      );
      res.redirect('/profile-test');
    } catch (error) {
      console.error(`Error while ${action}ing item:`, error);
      res.status(500).send('Internal Server Error');
    }
  };


  module.exports = handleLikeUnlike;