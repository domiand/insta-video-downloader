
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve index.html
app.use(express.static(__dirname));
app.use(cors());

// API endpoint
app.get("/api/download", async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get("https://saveig.app/api/ajaxSearch", {
      params: { q: url },
      headers: { "x-requested-with": "XMLHttpRequest" }
    });

    const videoUrl = response.data.links?.[0]?.url || null;

    if (videoUrl) {
      res.json({ success: true, videoUrl });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false });
  }
});

// Serve HTML at root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

