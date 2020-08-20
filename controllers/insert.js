const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        인서트 문 (관리자 인증 추가하면 좋을듯)
// @route       POST /api/v1/insert
// @request
// @response    success
exports.insertSearch = async (req, res, next) => {
  //   const conn = await connection.getConnection();
  let sport_query = `select SVCID from sport_rows`;
  let park_query = `select P_IDX from park_rows`;
  let way_query = `select CPI_IDX from way_rows`;

  try {
    // await conn.beginTransaction();
    [rows] = await connection.query(sport_query);
    let jsonObj = rows;
    let post = Object.keys(jsonObj).map(function (index) {
      let obj = jsonObj[index];
      return Object.keys(obj).map(function (val) {
        return obj[val];
      });
    });
    console.log(post);
    sport_query = `insert into search(S_SVCID) values ?`;
    park_query = `insert into search(S_P_IDX) values ?`;
    way_query = `insert into search(S_CPI_IDX) values ?`;

    [result] = await connection.query(sport_query, [post]);
    console.log(result);
    // await conn.commit();
    res.status(200).json({ success: true });
  } catch (e) {
    // await conn.rollback();
    res.status(500).json({ success: false, e });
  }
  //    finally {
  //     conn.release();
  //   }
};
