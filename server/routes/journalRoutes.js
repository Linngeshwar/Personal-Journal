const {
  createEntry,
  updateEntry,
  viewEntries,
  deleteEntry,
} = require("../controllers/JournalController");
const express = require("express");
const journalRouter = express.Router();
const authenticateToken = require("../middlewares/Authentication");

journalRouter.post("/create", authenticateToken, createEntry);
journalRouter.put("/update", authenticateToken, updateEntry);
journalRouter.get("/view", authenticateToken, viewEntries);
journalRouter.delete("/delete", authenticateToken, deleteEntry);

module.exports = journalRouter;
