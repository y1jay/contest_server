const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        즐겨찾기 추가
// @route       POST /api/v1/favorite
// @request
// @response    success, cnt, items[]
exports.addFavorite = async (req, res, next) => {
  let idx = req.body.idx;
  let isFavorite = req.body.isFavorite;
  let id = req.body.id;

  console.log(id);

  let query = `insert into favorite (idx, isFavorite,device) 
  values ("${idx}", ${isFavorite},"${id}")`;
  try {
    [rows] = await connection.query(query);
    if (rows.affectedRows != 1) {
      res.status(401).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (e) {
    if (e.rrno == 1062) {
      res.status(500).json({
        success: false,
        e,
        message: "이미 즐겨찾기에 추가되었습니다.",
      });
    } else {
      res.status(500).json({ success: false, e });
    }
  }
};

// @desc        즐겨찾기 불러오기(해당 정보)
// @route       GET /api/v1/favorite   ?id&offset
// @request
// @response    success, cnt, items[]
exports.getFavorite = async (req, res, next) => {
  let idx = req.body.idx;
  let offset = req.query.offset;

  let query = `select * from favorite as f
  left join sport_rows as s
  on f.idx = s.SVCID
  left join park_rows as p
  on f.idx = p.P_IDX
  left join way_rows as w
  on f.idx = w.CPI_NAME
  where f.idx = "${idx}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        즐겨찾기 불러오기(스포츠)
// @route       GET /api/v1/favorite/sport   ?id&offset&lat&lng
// @request
// @response    success, cnt, items[]
exports.sportIsFavorite = async (req, res, next) => {
  let id = req.query.id;
  let offset = req.query.offset;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let query = `SELECT  s.*,ifnull(f.isFavorite,0) as isFavorite,  
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM sport_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.SVCID = f.idx
  where  s.SVCID and device = "${id}"
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        즐겨찾기 불러오기(공원)
// @route       GET /api/v1/favorite/park ?id&offset
// @request
// @response    success, cnt, items[]
exports.parkIsFavorite = async (req, res, next) => {
  let id = req.query.id;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let offset = req.query.offset;
  let query = `SELECT  s.*,    ifnull(f.isFavorite,0) as isFavorite ,
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.LATITUDE ) ) * 
  cos( radians( s.LONGITUDE ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.LATITUDE ) ))) AS distance 
  FROM park_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.P_IDX = f.idx
  where f.idx = s.P_IDX and device = "${id}"
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        즐겨찾기 불러오기(두드림길)
// @route       GET /api/v1/favorite/way?id=&offset=
// @request
// @response    success, cnt, items[]
exports.wayIsFavorite = async (req, res, next) => {
  let offset = req.query.offset;
  let lat = req.query.lat;
  let lng = req.query.lng;
  let id = req.query.id;
  let query = `SELECT  s.*,  ifnull(f.isFavorite,0) as isFavorite , 
  ( 6371 * acos ( cos ( radians(${lat}) ) * cos( radians( s.X ) ) * 
  cos( radians( s.Y ) - radians(${lng}) ) + sin ( radians(${lat}) ) * 
  sin( radians( s.X ) ))) AS distance 
  FROM way_rows s 
  left join (select * from favorite where device = "${id}") as f
  on s.CPI_NAME = f.idx
  where f.idx = s.CPI_NAME and device = "${id}"
  HAVING distance < 400 ORDER BY distance LIMIT ${offset} ,25;`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        즐겨찾기 삭제
// @route       POST /api/v1/favorite/delete
// @request     body : id ,idx
// @response    success, cnt, items[]
exports.deleteFavorite = async (req, res, next) => {
  let id = req.body.id;
  let idx = req.body.idx;

  let query = `delete from favorite where idx = "${idx}" and device = "${id}"`;
  try {
    [rows] = await connection.query(query);
    if (rows.affectedRows != 1) {
      res.status(401).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, e, id: id, idx: idx });
  }
};
