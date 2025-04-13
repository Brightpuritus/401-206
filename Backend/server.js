const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Paths to JSON files
const profileDataPath = path.join(__dirname, "data", "profileData.json");
const postsDataPath = path.join(__dirname, "data", "postsData.json");

// Get all profiles
app.get("/api/profiles", (req, res) => {
  fs.readFile(profileDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read profiles data" });
    }
    res.json(JSON.parse(data).profiles);
  });
});

// Get a specific profile by username
app.get("/api/profiles/:username", (req, res) => {
  const username = req.params.username;
  fs.readFile(profileDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read profiles data" });
    }
    const profiles = JSON.parse(data).profiles;
    const profile = profiles.find((p) => p.username === username);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  });
});

// Update a profile
app.put("/api/profiles/:username", (req, res) => {
  const username = req.params.username;
  const updatedData = req.body;

  fs.readFile(profileDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data" });
    }
    const jsonData = JSON.parse(data);
    const profiles = jsonData.profiles;
    const profileIndex = profiles.findIndex((p) => p.username === username);

    if (profileIndex === -1) {
      return res.status(404).json({ error: "Profile not found" });
    }

    profiles[profileIndex] = { ...profiles[profileIndex], ...updatedData };
    fs.writeFile(profileDataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update data" });
      }
      res.json(profiles[profileIndex]);
    });
  });
});

// Get posts by username
app.get("/api/posts/:username", (req, res) => {
  const username = req.params.username;
  fs.readFile(postsDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read posts data" });
    }
    const posts = JSON.parse(data).posts;
    const userPosts = posts.filter((post) => post.username === username);
    res.json(userPosts);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});