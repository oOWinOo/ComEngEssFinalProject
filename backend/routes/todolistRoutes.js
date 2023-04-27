const express = require("express");
const todolistsController = require("../controller/todolistsController");

const router = express.Router();

router.get("/lists", todolistsController.getTodolists);
router.post("/add-user", todolistsController.addAssignmentUser);
router.delete("/:assignment_id", todolistsController.deleteAssignment);
router.post("/add", todolistsController.addAssignment);
module.exports = router;
