const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Paths to JSON files
const profileDataPath = path.join(__dirname, "data", "profileData.json");
const postsDataPath = path.join(__dirname, "data", "postsData.json");
const userDataPath = path.join(__dirname, "data", "Userdata.json");

// Setup multer for file uploads
const upload = multer({
  dest: path.join(__dirname, "uploads"),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


// Create a new post
app.post("/api/posts", upload.single("image"), (req, res) => {
  try {
    const { username, caption } = req.body;
    const image = req.file;

    if (!username || !caption || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    fs.readFile(postsDataPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading posts data:", err);
        return res.status(500).json({ error: "Failed to read posts data" });
      }

      const posts = data ? JSON.parse(data).posts : [];
      const newPost = {
        id: posts.length + 1,
        username,
        image: `/uploads/${image.filename}`,
        caption,
        likes: 0,
        comments: [],
      };

      posts.push(newPost);

      fs.writeFile(
        postsDataPath,
        JSON.stringify({ posts }, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing posts data:", err);
            return res.status(500).json({ error: "Failed to save post data" });
          }
          res.status(201).json({ message: "Post created successfully", post: newPost });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/posts", (req, res) => {
  fs.readFile(postsDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading posts data:", err);
      return res.status(500).json({ error: "Failed to read posts data" });
    }

    const posts = data ? JSON.parse(data).posts : [];
    res.json(posts);
  });
});

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

// API สำหรับบันทึกข้อมูลผู้ใช้
app.post("/api/register", (req, res) => {
  const newUser = req.body;

  // อ่านข้อมูลปัจจุบันจาก profileData.json
  fs.readFile(profileDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read profile data" });
    }

    const profiles = data ? JSON.parse(data).profiles : [];

    // ตรวจสอบว่ามี username หรือ email ซ้ำหรือไม่
    const isDuplicate = profiles.some(
      (profile) => profile.username === newUser.username || profile.email === newUser.email
    );

    if (isDuplicate) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // เพิ่มผู้ใช้ใหม่พร้อมค่าเริ่มต้น
    const newProfile = {
      id: profiles.length + 1, // สร้าง ID ใหม่
      username: newUser.username,
      fullName: newUser.fullname,
      email: newUser.email,
      password: newUser.password,
      avatar: "",
      followers: 0,
      following: 0,
      bio: "",
      website: "",
    };

    profiles.push(newProfile);

    // เขียนข้อมูลใหม่ลงใน profileData.json
    fs.writeFile(
      profileDataPath,
      JSON.stringify({ profiles }, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save profile data" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// API สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบ
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body; // identifier คือ username หรือ email

  // อ่านข้อมูลผู้ใช้จาก profileData.json
  fs.readFile(profileDataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read profile data" });
    }

    const profiles = data ? JSON.parse(data).profiles : [];

    // ค้นหาผู้ใช้ที่ตรงกับ username หรือ email และ password
    const user = profiles.find(
      (profile) =>
        (profile.username.toLowerCase() === identifier.toLowerCase() || // ตรวจสอบ username แบบ case-insensitive
         profile.email.toLowerCase() === identifier.toLowerCase()) &&
        profile.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }

    // ส่งข้อมูลผู้ใช้กลับไป (ไม่ควรส่ง password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});