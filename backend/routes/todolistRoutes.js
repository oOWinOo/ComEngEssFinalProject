const express = require("express");
const todolistsController = require("../controller/todolistsController");

const router = express.Router();

router.get("/lists", todolistsController.getTodolists);
router.post("/add", todolistsController.addAssignment);
router.delete("/:assignment_id", todolistsController.deleteAssignment);

module.exports = router;
