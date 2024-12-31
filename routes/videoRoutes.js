const express = require("express");
const { listVideos, streamVideo } = require("../controllers/videoController");

const router = express.Router();

router.get("/list", listVideos);
router.get("/stream/:videoName", streamVideo);

module.exports = router;
