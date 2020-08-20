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

  let query = `insert into favorite (idx, isFavorite) values ("${idx}", ${isFavorite})`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
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

// @desc        즐겨찾기 불러오기
// @route       GET /api/v1/favorite
// @request
// @response    success, cnt, items[]
exports.getFavorite = async (req, res, next) => {
  let idx = req.body.idx;

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

// @desc        즐겨찾기 삭제
// @route       DELETE /api/v1/favorite/:id
// @request
// @response    success, cnt, items[]
exports.deleteFavorite = async (req, res, next) => {
  let idx = req.body.idx;

  let query = `delete from favorite where idx = ${idx}`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, cnt: rows.length, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
