const express = require("express");
const {
  getLocationParking,
  getAddressParking,
} = require("../controllers/parking");

const router = express.Router();

router.route("/location").get(getLocationParking);
router.route("/address").get(getAddressParking);

module.exports = router;
