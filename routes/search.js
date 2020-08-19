const express = require("express");
const { getSearch, getAreaSearch } = require("../controllers/search");

const router = express.Router();

router.route("/").get(getSearch);
router.route("/area").get(getAreaSearch);

module.exports = router;
