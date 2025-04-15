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