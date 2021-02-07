const express = require("express");
const router = express.Router();
const authUser = require("./middleware/authUser");

const authControllers = require("./controllers/authControllers.js");
const noteControllers = require("./controllers/noteControllers.js");

router.post("/signup", authControllers.signup);
router.post("/signin", authControllers.signin);
router.get("/user", authUser, authControllers.user);
router.post("/validToken", authControllers.validToken);
router.post("/note/add", noteControllers.note_post);
router.get("/note/search", noteControllers.note_search);
router.post("/note/delete", noteControllers.note_delete);
router.get("/notes/get", authUser, noteControllers.notes_get);
router.get("/note/get", authUser, noteControllers.note_get);
router.post("/note/update", noteControllers.note_update);

module.exports = router;
