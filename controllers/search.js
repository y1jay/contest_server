const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        현제 위치 기반 키워드 검색
// @route       GET /api/v1/search?keyword=&lat=&lng=&offset=
// @request
// @response    success, cnt, items[]
exports.getSearch = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;

  let query = `SELECT  s.*,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM sport_rows s 
  where SVCNM like  "%${keyword}%" or PLACENM like "%${keyword}%" or MINCLASSNM like "%${keyword}%"
  HAVING distance < 100 ORDER BY distance LIMIT ${offset} ,25;`;
  console.log(query);
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        현제 위치 기반 지역 검색
// @route       GET /api/v1/search/area?keyword=&lat=&lng=&offset=
// @request
// @response    success, cnt, items[]
exports.getAreaSearch = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;

  let query = `SELECT  s.*,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM sport_rows s 
  where SVCNM like  "%${keyword}%" or AREANM like "%${keyword}%"
  HAVING distance < 100 ORDER BY distance LIMIT ${offset} ,25;`;
  console.log(query);
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
