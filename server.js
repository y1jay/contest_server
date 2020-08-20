const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// 내가 만든 파일 require는 이 아래에다가 넣자.
const search = require("./routes/search");
const favorite = require("./routes/favorite");
const insert = require("./routes/insert");
const parking = require("./routes/parking");

const app = express();
app.use(express.json());

app.use("/api/v1/search", search);
app.use("/api/v1/favorite", favorite);
app.use("/api/v1/insert", insert);
app.use("/api/v1/parking", parking);

const PORT = process.env.PORT || 5776;

app.listen(PORT, console.log("서버가동 !" + PORT));
