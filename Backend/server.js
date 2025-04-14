const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Paths to JSON files
const profileDataPath = path.join(__dirname, "data", "profileData.json");
const postsDataPath = path.join(__dirname, "data", "postsData.json");
const userDataPath = path.join(__dirname, "data", "Userdata.json");

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