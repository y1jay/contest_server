const express = require("express");
const {
  addFavorite,
  getFavorite,
  deleteFavorite,
  sportIsFavorite,
  parkIsFavorite,
  wayIsFavorite,
} = require("../controllers/favorite");

const router = express.Router();

router.route("/").post(addFavorite).get(getFavorite);
router.route("/delete").post(deleteFavorite);
router.route("/sport").get(sportIsFavorite);
router.route("/park").get(parkIsFavorite);
router.route("/way").get(wayIsFavorite);

module.exports = router;
