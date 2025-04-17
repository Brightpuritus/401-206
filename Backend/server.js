const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Paths to JSON files
const profileDataPath = path.join(__dirname, "data", "profileData.json");
const postsDataPath = path.join(__dirname, "data", "postsData.json");
const userDataPath = path.join(__dirname, "data", "Userdata.json");

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // กำหนดโฟลเดอร์ปลายทาง
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
    const filename = `${Date.now()}-${file.originalname}`; // ตั้งชื่อไฟล์ใหม่ (เช่น timestamp-ชื่อไฟล์เดิม)
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png and .jpg files are allowed"));
    }
  },
});


// Create a new post
app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { username, caption } = req.body;
    const image = req.file;

    if (!username || !caption || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await fs.readFile(postsDataPath, "utf8");
    const posts = data ? JSON.parse(data).posts : [];

    const newPost = {
      id: posts.length + 1,
      username,
      image: `/uploads/${image.filename}`,
      caption,
      likes: 0,
      likedBy: [],
      comments: [],
    };

    posts.push(newPost);

    await fs.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    if (error.message === "Only .png and .jpg files are allowed") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const data = await fs.readFile(postsDataPath, "utf8");
    const posts = data ? JSON.parse(data).posts : [];
    res.json(posts);
  } catch (error) {
    console.error("Error reading posts data:", error);
    res.status(500).json({ error: "Failed to read posts data" });
  }
});

// เพิ่ม API สำหรับไลค์โพสต์
// API สำหรับไลค์โพสต์
// API สำหรับไลค์/ยกเลิกไลค์โพสต์
app.post("/api/posts/:id/toggle-like", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // รับ username จาก request body
    const data = await fs.readFile(postsDataPath, "utf8");
    const posts = JSON.parse(data).posts;

    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ตรวจสอบว่า User ได้กดไลค์แล้วหรือยัง
    if (post.likedBy && post.likedBy.includes(username)) {
      // ยกเลิกการกดไลค์
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((user) => user !== username);
      await fs.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
      return res.json({ message: "Like removed successfully", likes: post.likes });
    }

    // เพิ่มไลค์
    post.likes += 1;
    post.likedBy = post.likedBy || [];
    post.likedBy.push(username);

    await fs.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: "Post liked successfully", likes: post.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

/// save post api
app.post('/api/posts/:id/toggle-save', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // อ่านข้อมูล posts จากไฟล์ JSON
    const data = await fs.readFile(postsDataPath, 'utf8');
    const posts = JSON.parse(data).posts;

    // ค้นหาโพสต์ที่ต้องการ
    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // ตรวจสอบและอัปเดต savedBy
    if (!post.savedBy) {
      post.savedBy = [];
    }

    if (post.savedBy.includes(username)) {
      // ลบ username ออกจาก savedBy
      post.savedBy = post.savedBy.filter((user) => user !== username);
    } else {
      // เพิ่ม username เข้าไปใน savedBy
      post.savedBy.push(username);
    }

    // บันทึกข้อมูลกลับไปยังไฟล์ JSON
    await fs.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));

    res.json({ isSaved: post.savedBy.includes(username) });
  } catch (error) {
    console.error('Error toggling save:', error);
    res.status(500).json({ error: 'Failed to toggle save' });
  }
});


// เพิ่ม API สำหรับคอมเมนต์โพสต์
app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await fs.readFile(postsDataPath, "utf8");
    const posts = JSON.parse(data).posts;

    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      id: Date.now(),
      username,
      text,
      timestamp: new Date().toISOString(),
    };

    post.comments.push(newComment);

    await fs.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: "Comment added successfully", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get all profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const data = await fs.readFile(profileDataPath, "utf8");
    const profiles = JSON.parse(data).profiles;
    res.json(profiles);
  } catch (error) {
    console.error("Error reading profiles data:", error);
    res.status(500).json({ error: "Failed to read profiles data" });
  }
});

// Get a specific profile by username
app.get("/api/profiles/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const data = await fs.readFile(path.join(__dirname, 'data', 'profileData.json'), 'utf8');
    const { profiles } = JSON.parse(data);
    const profile = profiles.find(p => p.username === username);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName } = req.body;
    
    const dataPath = path.join(__dirname, 'data', 'profileData.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    
    const profileIndex = data.profiles.findIndex(p => p.id === parseInt(id));
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    data.profiles[profileIndex].fullName = fullName;
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    
    res.json(data.profiles[profileIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by username
app.get("/api/posts/:username", async (req, res) => {
  try {
    // For now, return empty array since we don't have posts data
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get saved posts
app.get('/api/saved/:username', async (req, res) => {
  try {
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tagged posts
app.get('/api/tagged/:username', async (req, res) => {
  try {
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API สำหรับบันทึกข้อมูลผู้ใช้
// API สำหรับบันทึกข้อมูลผู้ใช้
app.post("/api/register", async (req, res) => {
  try {
    const newUser = req.body;
    const data = await fs.readFile(profileDataPath, "utf8");
    const profiles = data ? JSON.parse(data).profiles : [];

    const isDuplicate = profiles.some(
      (profile) => profile.username === newUser.username || profile.email === newUser.email
    );

    if (isDuplicate) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const newProfile = {
      id: profiles.length + 1,
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

    await fs.writeFile(profileDataPath, JSON.stringify({ profiles }, null, 2));
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving profile data:", error);
    res.status(500).json({ error: "Failed to save profile data" });
  }
});

// API สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบ
// API สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบ
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier คือ username หรือ email

    // อ่านข้อมูลผู้ใช้จาก profileData.json
    const data = await fs.readFile(profileDataPath, "utf8");
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
  } catch (error) {
    console.error("Error reading profile data:", error);
    res.status(500).json({ error: "Failed to read profile data" });
  }
});

// Endpoint สำหรับ postsData.json
app.get("/api/posts", (req, res) => {
  const filePath = path.join(__dirname, "data", "postsData.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load posts data" });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint สำหรับ profileData.json
app.get("/api/profiles", (req, res) => {
  const filePath = path.join(__dirname, "data", "profileData.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load profiles data" });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});