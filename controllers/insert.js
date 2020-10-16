const connection = require("../db/mysql_connection");
const proj4 = require("proj4");


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

// @desc        두드림길 위도 경도 변환
// @route       PUT /api/v1/insert/updateway
// @request
// @response    success
exports.updateWayLocation = async (req, res, next) => {
  //   const conn = await connection.getConnection();

  let xyquery1 = `SELECT X,Y FROM contest.way_rows order by id limit 0,1500`;
  console.log(xyquery1);
  let xyquery2 = `SELECT * FROM contest.way_rows order by id limit 800,800`;
  try {
    // await conn.beginTransaction();
    [rows] = await connection.query(xyquery1);
    let jsonObj = rows;
    let post = Object.keys(jsonObj).map(function (index) {
      let obj = jsonObj[index];
      return Object.keys(obj).map(function (val) {
        return obj[val];
      });
    });
    console.log("post", post);

    var firstProjection =
      "+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=288250 +y_0=500100 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
    var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    for (let i = 0; i < post.length; i++) {
      console.log(post[0]);
      let lonAndLat1 = proj4(firstProjection, secondProjection, post[i]);

      console.log(lonAndLat1[0]);
      way_query = `update way_rows set Y = ${lonAndLat1[0]},X= ${
        lonAndLat1[1]
      } where id =${i + 1}`;
      console.log(way_query);
      try {
        [result] = await connection.query(xyquery1);
      } catch (e) {
        res.status(404).json({ success: false, e: e });
      }
    }
    res.status(200).json({ success: true });

    //  await conn.commit();
  } catch (e) {
    // await conn.rollback();
    res.status(500).json({ success: false, e: e });
  }
};
