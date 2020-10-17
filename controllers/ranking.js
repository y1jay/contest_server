const connection = require("../db/mysql_connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc        add ranking
// @route       POST /api/v1/ranking/add
// @request
// @response    success
exports.addRanking = async (req, res, next) => {
  //   const conn = await connection.getConnection();
  let rankingId = req.body.rankingId;
  let evnet = req.body.evnet;
  let query;

  if (evnet == 1) {
    query = `insert into ranking(s_svcid)values("${rankingId}")`;
  } else if (evnet == 2) {
    query = `insert into ranking(p_idx)values(${rankingId})`;
  } else if (evnet == 3) {
    query = `insert into ranking(w_idx)values(${rankingId})`;
  } else {
    res.status(401).Json({ seccess: false });
  }

  try {
    [result] = await connection.query(query);
    if (affectedRows != 1) {
      res.status(401).Json({ seccess: false });
    }
    res.status(200).json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc        get ranking
// @route       GET /api/v1/ranking/count
// @request
// @response    success
exports.countRanking = async (req, res, next) => {
  //   const conn = await connection.getConnection();

  let query = `select count(s_svcid) as sport,count(w_idx)as way,count(p_idx) as park from ranking ;`;
  // 1 sprots, 2 park, 3way
  let cnt;
  try {
    [cntrows] = await connection.query(query);
  } catch (e) {
    res.status(500).json({ success: false, e });
    return;
  }
  cnt = cntrows;

<<<<<<< HEAD
  let sportQuery = `select * ,count(r.id) scnt
  from ranking as r
  join sport_rows as s
  on r.s_svcid = s.SVCID group by r.s_svcid order by scnt desc limit 0, 4;`;
  // 1 sprots, 2 park, 3way
  let sport;
  try {
    [sportRows] = await connection.query(sportQuery);
  } catch (e) {
    res.status(500).json({ success: false, e });
    return;
  }
  sport = sportRows;

  let parkQuery = `select * ,count(r.id) as pcnt
  from ranking as r
  join park_rows as p
  on r.p_idx = p.P_IDX
  group by r.p_idx order by pcnt desc limit 0, 4;`;
  // 1 sprots, 2 park, 3way
  let park;
  try {
    [parkRows] = await connection.query(parkQuery);
  } catch (e) {
    res.status(500).json({ success: false, e });
    return;
  }
  park = parkRows;

  let wayQuery = `select * ,count(r.id) as wcnt
  from ranking as r
  join way_rows as w
  on r.w_idx = w.CPI_IDX
  group by r.w_idx order by wcnt desc limit 0, 4;`;
=======
  let sportQuery = `SELECT SVCID, AREANM , SVCNM , IMGURL, SVCURL,Category, count(SVCID) CNT
  FROM
	(SELECT s.SVCID,s.AREANM , concat(s.SVCNM, " (" , s.MINCLASSNM , ")") AS SVCNM , s.IMGURL,s.SVCURL,"sport" AS Category
	   FROM ranking as r
	   JOIN sport_rows as s
		 ON r.s_svcid = s.SVCID
	  WHERE s.SVCID IS NOT NULL
	 UNION ALL
	SELECT p.P_IDX,p.P_ZONE,p.P_PARK,p.P_IMG,p.TEMPLATE_URL,"park" AS Category
	  from ranking as r
	  join park_rows as p
	   on r.p_idx  = p.P_IDX
	UNION ALL
	SELECT  w.CPI_IDX,w.AREA_GU, w.CPI_NAME, "" AS temp1, "" AS temp2,"way" AS Category
	  from ranking as r
	  join way_rows as w
	    on w.CPI_IDX = r.w_idx) AS ranking
 GROUP BY SVCID, AREANM , SVCNM ORDER BY CNT DESC LIMIT 0,20;
`;
>>>>>>> parent of bec5ade... 랭킹 수정
  // 1 sprots, 2 park, 3way
  let way;
  try {
    [wayRows] = await connection.query(wayQuery);
  } catch (e) {
    res.status(500).json({ success: false, e });
    return;
  }
  way = wayRows;

  res.status(200).json({ success: true, cnt, sport, park, way });
};
