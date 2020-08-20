const express = require("express");
const {
  getSearch,
  getSports,
  getPark,
  getWay,
  getWaySearch,
  getParkSearch,
} = require("../controllers/search");

const router = express.Router();

router.route("/").get(getSearch);
router.route("/sports").get(getSports);
router.route("/park").get(getPark);
router.route("/way").get(getWay);
router.route("/parksearch").get(getParkSearch);
router.route("/waysearch").get(getWaySearch);

module.exports = router;
