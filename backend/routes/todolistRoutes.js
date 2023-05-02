const express = require("express");
const todolistsController = require("../controller/todolistsController");

const router = express.Router();

router.get("/lists", todolistsController.getTodolists);
router.delete("/:assignment_id", todolistsController.deleteAssignment);
router.post("/add", todolistsController.addAssignment);
router.patch("/update",todolistsController.updateAssignment)
module.exports = router;
