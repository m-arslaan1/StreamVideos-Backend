const express = require("express");
const router = require("./routes/videoRoutes");
const cors = require("cors")
const path = require("path");

const app = express();
const port = 3500;
app.use(express.json());

app.use(cors({
  origin: 'https://stream-videos-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/video', router);

app.use('/videos', express.static(path.join(__dirname, '../videos')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
