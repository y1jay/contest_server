const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        시설물 위치기반 주차장
// @route       GET /api/v1/parking/location/way?offset=&lat=&lng=
// @request
// @response    success, cnt, items[]
exports.getLocationParking = async (req, res, next) => {
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;

  let query = `SELECT  s.*,  
    ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.lat ) ) * 
    cos( radians( s.lng ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
    sin( radians( s.lat ) ))) AS distance 
    FROM parking s 
    HAVING distance < 100 ORDER BY distance LIMIT ${offset} ,25`;

  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        주소 검색 주차장
// @route       GET /api/v1/parking/address/way?keyword&offset=&lat=&lng=
// @request
// @response    success, cnt, items[]
exports.getAddressParking = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;

  let query = `SELECT  s.*,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.lat ) ) * 
  cos( radians( s.lng ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.lat ) ))) AS distance 
    FROM parking s 
    where s.addr like "%${keyword}%"
    HAVING distance < 100 ORDER BY distance LIMIT ${offset} ,25`;

  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
