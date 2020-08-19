const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        즐겨찾기 보기
// @route       GET /api/v1/favorite
// @request
// @response    success, cnt, items[]
exports.addFavorite = async (req, res, next) =>{
    let query = 'select * from sport_rows'
}