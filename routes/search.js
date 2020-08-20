const express = require("express");
const {
  getSportSearch,
  getSports,
  getPark,
  getWay,
  getWaySearch,
  getParkSearch,
} = require("../controllers/search");

const router = express.Router();

router.route("/sportsearch").get(getSportSearch);
router.route("/sports").get(getSports);
router.route("/park").get(getPark);
router.route("/way").get(getWay);
router.route("/parksearch").get(getParkSearch);
router.route("/waysearch").get(getWaySearch);

module.exports = router;
