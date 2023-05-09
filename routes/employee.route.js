const { Router } = require("express");
const { EmployeeModel } = require("../model/employee.model");

const employeeRouter = Router();

// GET
employeeRouter.get("/employee", async (req, res) => {
  const { department, page = 1, salary, firstname } = req.query;
  let query = {};

  if (
    department === "Tech" ||
    department === "Operations" ||
    department === "Marketing"
  ) {
    query.department = department;
  }
  // if (salary) {
  //   query.salary = salary;
  // }

  if (firstname) {
    query.firstname = { firstname: { $regex: new RegExp(firstname, "i") } };
  }

  const pageNo = page;
  const limit = 5;
  const skip = (pageNo - 1) * limit;

  try {
    if (salary === "asc") {
      const employee = await EmployeeModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ salary: 1 });
      res.status(200).send(employee);
    } else if (salary === "desc") {
      const employee = await EmployeeModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ salary: -1 });
      res.status(200).send(employee);
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// POST
employeeRouter.post("/employee", async (req, res) => {
  const payload = req.body;
  try {
    const employee = new EmployeeModel(payload);
    await employee.save();
    res.status(201).send({ message: "Employee has been saved" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// PATCH
employeeRouter.patch("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      { _id: id },
      payload
    );
    res.status(200).send({ message: "EmployeeDetails Updated" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Delete
employeeRouter.delete("/employee/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await EmployeeModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ message: "Employee has been Deleted" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = { employeeRouter };
