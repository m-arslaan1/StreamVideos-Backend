const fs = require("fs");
const path = require("path");

const streamVideo = (req, res) => {
  const videoName = req.params.videoName;
  const videoFilePath = path.join(__dirname, "../videos", videoName);

  if (!fs.existsSync(videoFilePath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoFilePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoFilePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize) {
    return res.status(416).send("Requested range not satisfiable");
  }

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(videoFilePath, { start, end });
  const head = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, head);
  file.pipe(res);
};

const listVideos = (req, res) => {
  const videoDir = path.join(__dirname, "../videos");
  fs.readdir(videoDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    const videoFiles = files.filter((file) => file.endsWith(".mp4"));
    res.json(videoFiles);
  });
};

module.exports = {
  listVideos,
  streamVideo,
};
