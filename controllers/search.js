const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        스포츠 검색
// @route       GET /api/v1/search/sportsearch?keyword=&lat=&lng=&offset=
// @request
// @response    success, cnt, items[]
exports.getSportSearch = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  let query = `SELECT  s.*,ifnull(f.isFavorite,0) as isFavorite,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM sport_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.SVCID = f.idx
  where SVCNM like  "%${keyword}%" or PLACENM like "%${keyword}%" or MINCLASSNM like "%${keyword}%"
  or AREANM like "%${keyword}%"
  HAVING distance < 1000 ORDER BY distance LIMIT ${offset} ,25;`;
  console.log(query);
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        sport 종목 별 main 화면용
// @route       GET /api/v1/search/sports?keyword=&offset=
// @request
// @response    success, cnt, items[]
exports.getSports = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  if (keyword) {
  }

  let query = `SELECT  s.*,ifnull(f.isFavorite,0) as isFavorite,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM sport_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.SVCID = f.idx
  where MINCLASSNM like "%${keyword}%"
  HAVING distance < 1000 ORDER BY distance LIMIT ${offset} ,25;`;
  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        park  main 화면용
// @route       GET /api/v1/search/park?offset=&lat=&lng
// @request
// @response    success, cnt, items[]
exports.getPark = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  let query = `SELECT  s.*,  ifnull(f.isFavorite,0) as isFavorite ,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.LATITUDE ) ) * 
  cos( radians( s.LONGITUDE ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.LATITUDE ) ))) AS distance 
  FROM park_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.P_IDX = f.idx
  HAVING distance < 1000 ORDER BY distance LIMIT ${offset} ,25;`;
  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        way main 화면용
// @route       GET /api/v1/search/way?&offset=
// @request
// @response    success, cnt, items[]
exports.getWay = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  let query = `SELECT  s.*,    ifnull(f.isFavorite,0) as isFavorite , 
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM way_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.CPI_NAME = f.idx
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25;`;

  let testquery = `select s.*,ifnull(f.isFavorite,0) as isFavorite 
  from way_rows as s
  left join (select * from favorite where device = "${id}") as f
  on s.CPI_NAME = f.idx
   limit ${offset},25`;

  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        park  검색
// @route       GET /api/v1/search/parksearch?keyword=&offset=&lat=&lng
// @request
// @response    success, cnt, items[]
exports.getParkSearch = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  let query = `SELECT  s.*,    ifnull(f.isFavorite,0) as isFavorite ,
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.LATITUDE ) ) * 
  cos( radians( s.LONGITUDE ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.LATITUDE ) ))) AS distance 
  FROM park_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.P_IDX = f.idx
  where s.P_PARK like "%${keyword}%" or s.P_ZONE like "%${keyword}%"
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25;`;
  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        way검색
// @route       GET /api/v1/search/waysearch?keyword=&offset=
// @request
// @response    success, cnt, items[]
exports.getWaySearch = async (req, res, next) => {
  let keyword = req.query.keyword;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let id = req.query.id;

  let query = `SELECT  s.*,  ifnull(f.isFavorite,0) as isFavorite , 
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM way_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.CPI_NAME = f.idx
  where COURSE_NAME like "%${keyword}%" or AREA_GU like "%${keyword}%" or s.CPI_NAME like "%${keyword}%"
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25;`;

  try {
    [rows] = await connection.query(query);

    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
