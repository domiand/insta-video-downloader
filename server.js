
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/download', async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get(`https://saveig.app/api/ajaxSearch`, {
      params: { q: url },
      headers: {
        "x-requested-with": "XMLHttpRequest"
      }
    });

    // You must parse the response to extract the video URL (simplified here)
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
