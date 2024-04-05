const express = require("express");
const router = express.Router();



router.get('/error', async (req, res, next) => {
    const user = req.session.user;
    res.status(500).render('pages/error', { error: "Plopkoek Tom" , user});
});

module.exports = router;

