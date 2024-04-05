const express = require("express");
const router = express.Router();



router.get('/error', async (req, res, next) => {
    res.status(500).render('error', { error: "Plopkoek Tom" });


});

module.exports = router;

