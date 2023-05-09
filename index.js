const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { employeeRouter } = require("./routes/employee.route");

app.use(express.json());
app.use(cors());

app.get((req, res) => {
  res.send("Hello");
});

app.use("/", userRouter);
app.use("/", employeeRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
  console.log(`server running on ${process.env.PORT}`);
});
