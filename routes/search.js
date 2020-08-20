const express = require("express");
const { getSearch, getAllsSearch } = require("../controllers/search");

const router = express.Router();

router.route("/").get(getSearch);
router.route("/area").get(getAllsSearch);

module.exports = router;
