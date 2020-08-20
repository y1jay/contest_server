const express = require("express");

const { insertSearch } = require("../controllers/insert");

const router = express.Router();

router.route("/").get(insertSearch);

module.exports = router;
