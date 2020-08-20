const express = require("express");
const {
  addFavorite,
  getFavorite,
  deleteFavorite,
} = require("../controllers/favorite");

const router = express.Router();

router.route("/").post(addFavorite).get(getFavorite);
router.route("/delete").post(deleteFavorite);

module.exports = router;
