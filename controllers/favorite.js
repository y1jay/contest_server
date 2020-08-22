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
// @route       GET /api/v1/favorite/sport   ?id&offset
// @request
// @response    success, cnt, items[]
exports.sportIsFavorite = async (req, res, next) => {
  let id = req.query.id;
  let offset = req.query.offset;
  let query = `select * 
  from favorite as f
    left join sport_rows as s
    on f.idx = s.SVCID
    where f.idx = s.SVCID and device = "${id}" limit ${offset},25`;

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
  let offset = req.query.offset;
  let query = `select * from favorite as f
    left join park_rows as p
    on f.idx = p.P_IDX
    where f.idx = p.P_IDX and device = "${id}" limit ${offset},25`;

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
  let id = req.query.id;
  let query = `select * from favorite as f
    left join way_rows as w
    on f.idx = w.CPI_NAME
    where f.idx = w.CPI_NAME and device = "${id}" limit ${offset},25`;

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

  let query = `delete from favorite where idx = ${idx} and device = "${id}"`;
  try {
    [rows] = await connection.query(query);
    if (rows.affectedRows != 1) {
      res.status(401).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
