const express = require("express");
const { countRanking, addRanking } = require("../controllers/ranking");

const router = express.Router();
router.route("/count").get(countRanking);
router.route("/add").post(addRanking);
module.exports = router;
