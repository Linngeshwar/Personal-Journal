const pool = require("../db");

const createEntry = async (req, res) => {
  const user_id = req.user.user_id;
  const title = req.body.title;
  const content = req.body.content;
  try {
    const result = await pool.query(
      "INSERT INTO JOURNAL_ENTRIES(user_id,title,content) values($1,$2,$3)",
      [user_id, title, content]
    );
    res.status(201).json({ result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateEntry = async (req, res) => {
  const note_id = req.body.note_id;
  const new_title = req.body.title;
  const new_content = req.body.content;

  try {
    const result = await pool.query(
      "UPDATE JOURNAL_ENTRIES SET title = $1 , content = $2 WHERE id = $3",
      [new_title, new_content, note_id]
    );
    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const viewEntries = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      "SELECT * FROM JOURNAL_ENTRIES WHERE user_id = $1",
      [user_id]
    );
    res.status(200).json({ entries: result.rows });
  } catch (err) {
    console.log(err), res.status(500).json({ error: err });
  }
};

const deleteEntry = async (req, res) => {
  const note_id = req.body.note_id;
  const user_id = req.user.user_id;
  console.log(note_id, user_id);
  try {
    const result = await pool.query(
      "DELETE FROM JOURNAL_ENTRIES WHERE id = $1 AND user_id = $2",
      [note_id, user_id]
    );
    if (result.rowCount != 0) {
      res.status(200).json({ result });
    } else {
      res.status(400).json({ error: "could not delete" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

module.exports = { createEntry, updateEntry, viewEntries, deleteEntry };
