const express = require("express");

const { insertSearch, updateWayLocation } = require("../controllers/insert");

const router = express.Router();

router.route("/").get(insertSearch);
router.route("/updateway").put(updateWayLocation);
module.exports = router;
