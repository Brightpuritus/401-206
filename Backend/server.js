const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/avatars", express.static(path.join(__dirname, "uploads/avatars")));

// Paths to JSON files
const profileDataPath = path.join(__dirname, "data", "profileData.json");
const postsDataPath = path.join(__dirname, "data", "postsData.json");
const userDataPath = path.join(__dirname, "data", "Userdata.json");
const chatDataPath = path.join(__dirname, "data", "chatData.json");
const notificationsDataPath = path.join(__dirname, "data", "notificationsData.json");

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

// Add avatar storage configuration
const avatarStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, 'public', 'avatars');
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadAvatar = multer({ storage: avatarStorage });

// Add static middleware for serving avatars
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// Create necessary directories
const createRequiredDirectories = () => {
  const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'avatars'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Call this before starting the server
createRequiredDirectories();

// Create a new post
app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { username, caption } = req.body;
    const image = req.file;

    if (!username || !caption || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await fsPromises.readFile(postsDataPath, "utf8");
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

    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
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
    const data = await fsPromises.readFile(postsDataPath, "utf8");
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
    const { username } = req.body;

    const data = await fsPromises.readFile(postsDataPath, "utf8");
    const posts = JSON.parse(data).posts;

    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isLiked = post.likedBy.includes(username);
    if (isLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((user) => user !== username);
    } else {
      post.likes += 1;
      post.likedBy.push(username);

      // เพิ่ม notification
      if (post.username !== username) {
        await addNotification({
          id: Date.now(),
          type: "like",
          sender: username,
          recipient: post.username,
          postId: post.id,
          timestamp: new Date().toISOString(),
        });
      }
    }

    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: isLiked ? "Like removed successfully" : "Post liked successfully", likes: post.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// API สำหรับแก้ไขโพสต์
app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    const data = await fsPromises.readFile(postsDataPath, "utf8");
    const posts = JSON.parse(data).posts;

    const postIndex = posts.findIndex((p) => p.id === parseInt(id));
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ลบรูปภาพเก่าออกจากระบบไฟล์ ถ้ามีการอัปโหลดรูปภาพใหม่
    if (req.file) {
      const oldImagePath = path.join(__dirname, posts[postIndex].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // ลบไฟล์เก่า
      }
      posts[postIndex].image = `/uploads/${req.file.filename}`; // อัปเดตรูปภาพใหม่
    }

    // อัปเดต caption ถ้ามี
    if (caption) {
      posts[postIndex].caption = caption;
    }

    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: "Post updated successfully", post: posts[postIndex] });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

//;/ API สำหรับลบโพสต์
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await fsPromises.readFile(postsDataPath, "utf8");
    const posts = JSON.parse(data).posts;

    const postIndex = posts.findIndex((p) => p.id === parseInt(id));
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    posts.splice(postIndex, 1); // ลบโพสต์ออกจากอาร์เรย์

    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

/// save post api
app.post('/api/posts/:id/toggle-save', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // อ่านข้อมูล posts จากไฟล์ JSON
    const data = await fsPromises.readFile(postsDataPath, 'utf8');
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
    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));

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

    const data = await fsPromises.readFile(postsDataPath, "utf8");
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

    // เพิ่ม notification
    if (post.username !== username) {
      await addNotification({
        id: Date.now(),
        type: "comment",
        sender: username,
        recipient: post.username,
        postId: post.id,
        text,
        timestamp: new Date().toISOString(),
      });
    }

    await fsPromises.writeFile(postsDataPath, JSON.stringify({ posts }, null, 2));
    res.json({ message: "Comment added successfully", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get all profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const data = await fsPromises.readFile(profileDataPath, "utf8");
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
    const data = await fsPromises.readFile(path.join(__dirname, 'data', 'profileData.json'), 'utf8');
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
    const data = JSON.parse(await fsPromises.readFile(dataPath, 'utf8'));
    
    const profileIndex = data.profiles.findIndex(p => p.id === parseInt(id));
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    data.profiles[profileIndex].fullName = fullName;
    await fsPromises.writeFile(dataPath, JSON.stringify(data, null, 2));
    
    res.json(data.profiles[profileIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add avatar upload endpoint
app.put('/api/profiles/:id/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarPath = `/avatars/${req.file.filename}`;
    const data = JSON.parse(await fsPromises.readFile(profileDataPath, 'utf8'));
    
    const profileIndex = data.profiles.findIndex(p => p.id === parseInt(id));
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Remove old avatar file if it exists
    if (data.profiles[profileIndex].avatar) {
      const oldAvatarPath = path.join(__dirname, 'public', data.profiles[profileIndex].avatar);
      if (fs.existsSync(oldAvatarPath)) {
        await fsPromises.unlink(oldAvatarPath);
      }
    }
    
    data.profiles[profileIndex].avatar = avatarPath;
    await fsPromises.writeFile(profileDataPath, JSON.stringify(data, null, 2));
    
    res.json(data.profiles[profileIndex]);
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
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
app.post("/api/register", async (req, res) => {
  try {
    const newUser = req.body;
    const data = await fsPromises.readFile(profileDataPath, "utf8");
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
      avatar: "/avatars/placeholder-person.jpg",
      followers: [],
      following: [],
      bio: "",
      website: "",
    };

    profiles.push(newProfile);

    await fsPromises.writeFile(profileDataPath, JSON.stringify({ profiles }, null, 2));
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
    const data = await fsPromises.readFile(profileDataPath, "utf8");
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

// API: Get chat messages between two users
app.get("/api/chats/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const data = await fsPromises.readFile(chatDataPath, "utf8");
    const chats = JSON.parse(data).chats;

    // ค้นหาข้อความระหว่าง user1 และ user2
    const conversation = chats.find(
      (chat) =>
        (chat.user1 === user1 && chat.user2 === user2) ||
        (chat.user1 === user2 && chat.user2 === user1)
    );

    res.json(conversation ? conversation.messages : []);
  } catch (error) {
    console.error("Error reading chat data:", error);
    res.status(500).json({ error: "Failed to read chat data" });
  }
});

// API: Add a new message to the chat
app.post("/api/chats", async (req, res) => {
  try {
    const { sender, recipient, text } = req.body;

    if (!sender || !recipient || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await fsPromises.readFile(chatDataPath, "utf8");
    const chats = JSON.parse(data).chats;

    // ค้นหาหรือสร้างบทสนทนาใหม่
    let conversation = chats.find(
      (chat) =>
        (chat.user1 === sender && chat.user2 === recipient) ||
        (chat.user1 === recipient && chat.user2 === sender)
    );

    if (!conversation) {
      conversation = {
        user1: sender,
        user2: recipient,
        messages: [],
      };
      chats.push(conversation);
    }

    // เพิ่มข้อความใหม่
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    conversation.messages.push(newMessage);

    // บันทึกข้อมูลกลับไปยังไฟล์ JSON
    await fsPromises.writeFile(chatDataPath, JSON.stringify({ chats }, null, 2));

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving chat data:", error);
    res.status(500).json({ error: "Failed to save chat data" });
  }
});

// API: Follow or unfollow a user
app.post("/api/profiles/:username/toggle-follow", async (req, res) => {
  try {
    const { username } = req.params;
    const { currentUser } = req.body;

    if (!currentUser) {
      return res.status(400).json({ error: "Current user is required" });
    }

    const data = JSON.parse(await fsPromises.readFile(profileDataPath, "utf8"));
    const profiles = data.profiles;

    const userToFollow = profiles.find((profile) => profile.username === username);
    const currentUserProfile = profiles.find((profile) => profile.username === currentUser);

    if (!userToFollow || !currentUserProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    const isFollowing = currentUserProfile.following.includes(username);

    if (isFollowing) {
      // Unfollow
      currentUserProfile.following = currentUserProfile.following.filter((u) => u !== username);
      userToFollow.followers = userToFollow.followers.filter((u) => u !== currentUser);
    } else {
      // Follow
      currentUserProfile.following.push(username);
      userToFollow.followers.push(currentUser);

      // เพิ่ม Notification
      await addNotification({
        id: Date.now(),
        type: "follow",
        sender: currentUser,
        recipient: username,
        timestamp: new Date().toISOString(),
      });
    }

    // Save changes
    await fsPromises.writeFile(profileDataPath, JSON.stringify(data, null, 2));

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      followers: userToFollow.followers,
      following: currentUserProfile.following,
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ error: "Failed to toggle follow" });
  }
});

// เพิ่ม notification
const addNotification = async (notification) => {
  const data = await fsPromises.readFile(notificationsDataPath, "utf8");
  const notifications = data ? JSON.parse(data).notifications : [];
  notifications.push(notification);
  await fsPromises.writeFile(notificationsDataPath, JSON.stringify({ notifications }, null, 2));
};

// API สำหรับดึง notification ของผู้ใช้
app.get("/api/notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching notifications for username:", username);

    const data = await fsPromises.readFile(notificationsDataPath, "utf8");
    const notifications = JSON.parse(data).notifications;

    // กรองการแจ้งเตือนสำหรับผู้ใช้ที่ระบุ
    const userNotifications = notifications.filter((n) => n.recipient === username);
    console.log("Filtered notifications:", userNotifications);

    res.json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});