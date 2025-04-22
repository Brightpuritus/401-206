const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My App API",
      version: "1.0.0",
      description: "API documentation for your app",
    },
    servers: [
      { url: "http://localhost:5000" }
    ],
  },
  apis: [__filename], // หรือใส่ path ของไฟล์ route อื่นๆ
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// เพิ่ม endpoint สำหรับ Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Post management
 *   - name: Profiles
 *     description: User profile management
 *   - name: Events
 *     description: Event management
 *   - name: Chats
 *     description: Chat management
 *   - name: Notifications
 *     description: Notification management
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: List of posts
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: username
 *         type: string
 *         required: true
 *       - in: formData
 *         name: caption
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *     responses:
 *       201:
 *         description: Post created successfully
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a post by id
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: caption
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */

/**
 * @swagger
 * /api/posts/{id}/toggle-like:
 *   post:
 *     tags: [Posts]
 *     summary: Like or unlike a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: username
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */

/**
 * @swagger
 * /api/posts/{id}/comment:
 *   post:
 *     tags: [Posts]
 *     summary: Add a comment to a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: comment
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             text:
 *               type: string
 *     responses:
 *       200:
 *         description: Comment added
 */

/**
 * @swagger
 * /api/posts/{id}/toggle-save:
 *   post:
 *     tags: [Posts]
 *     summary: Save or unsave a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: username
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       200:
 *         description: Save toggled
 */

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     tags: [Profiles]
 *     summary: Get all profiles
 *     responses:
 *       200:
 *         description: List of profiles
 */

/**
 * @swagger
 * /api/profiles/{username}:
 *   get:
 *     tags: [Profiles]
 *     summary: Get a profile by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile data
 */

/**
 * @swagger
 * /api/profiles/{id}:
 *   put:
 *     tags: [Profiles]
 *     summary: Update a profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: profile
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             bio:
 *               type: string
 *             website:
 *               type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/profiles/{id}/avatar:
 *   put:
 *     tags: [Profiles]
 *     summary: Update profile avatar
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: avatar
 *         type: file
 *         required: true
 *     responses:
 *       200:
 *         description: Avatar updated
 */

/**
 * @swagger
 * /api/profiles/{username}/toggle-follow:
 *   post:
 *     tags: [Profiles]
 *     summary: Follow or unfollow a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: currentUser
 *         schema:
 *           type: object
 *           properties:
 *             currentUser:
 *               type: string
 *     responses:
 *       200:
 *         description: Follow/unfollow result
 */

/**
 * @swagger
 * /api/profiles/{username}/followers:
 *   get:
 *     tags: [Profiles]
 *     summary: Get followers of a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followers
 */

/**
 * @swagger
 * /api/profiles/{username}/following:
 *   get:
 *     tags: [Profiles]
 *     summary: Get following of a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of following
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events
 *     responses:
 *       200:
 *         description: List of events
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: date
 *         type: string
 *         required: true
 *       - in: formData
 *         name: time
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *     responses:
 *       201:
 *         description: Event created
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event data
 *   put:
 *     tags: [Events]
 *     summary: Update event by id
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event updated
 *   delete:
 *     tags: [Events]
 *     summary: Delete event by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted
 */

/**
 * @swagger
 * /api/chats/{user1}/{user2}:
 *   get:
 *     tags: [Chats]
 *     summary: Get chat messages between two users
 *     parameters:
 *       - in: path
 *         name: user1
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: user2
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */

/**
 * @swagger
 * /api/chats:
 *   post:
 *     tags: [Chats]
 *     summary: Add a new message to the chat
 *     parameters:
 *       - in: body
 *         name: message
 *         schema:
 *           type: object
 *           properties:
 *             sender:
 *               type: string
 *             recipient:
 *               type: string
 *             text:
 *               type: string
 *     responses:
 *       201:
 *         description: Message sent
 */

/**
 * @swagger
 * /api/notifications/{username}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications for a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *   put:
 *     summary: Update a post by id
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: caption
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *     responses:
 *       200:
 *         description: Post updated successfully
 */

// post----------------------------------------------------------------------------------


// Create a new post
app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { username, caption } = req.body;
    const image = req.file;
    if (!username || !caption || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [result] = await pool.query(
      "INSERT INTO posts (username, image, caption, likes) VALUES (?, ?, ?, 0)",
      [username, `/uploads/${image.filename}`, caption]
    );
    const [rows] = await pool.query("SELECT * FROM posts WHERE id=?", [result.insertId]);
    res.status(201).json({ message: "Post created successfully", post: rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const [posts] = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    for (const post of posts) {
      // ดึง likedBy, savedBy, comments
      const [likedBy] = await pool.query("SELECT username FROM post_likes WHERE post_id=?", [post.id]);
      const [savedBy] = await pool.query("SELECT username FROM post_saves WHERE post_id=?", [post.id]);
      const [comments] = await pool.query("SELECT * FROM post_comments WHERE post_id=? ORDER BY timestamp ASC", [post.id]);
      post.likedBy = likedBy.map(l => l.username);
      post.savedBy = savedBy.map(s => s.username);
      post.comments = comments;
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to read posts data" });
  }
});


// API สำหรับไลค์/ยกเลิกไลค์โพสต์
app.post("/api/posts/:id/toggle-like", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const [postRows] = await pool.query("SELECT * FROM posts WHERE id=?", [id]);
    const post = postRows[0];
    if (!post) return res.status(404).json({ error: "Post not found" });

    const [liked] = await pool.query("SELECT * FROM post_likes WHERE post_id=? AND username=?", [id, username]);
    if (liked.length > 0) {
      await pool.query("DELETE FROM post_likes WHERE post_id=? AND username=?", [id, username]);
      await pool.query("UPDATE posts SET likes = likes - 1 WHERE id=?", [id]);
      res.json({ message: "Like removed successfully" });
    } else {
      await pool.query("INSERT INTO post_likes (post_id, username) VALUES (?, ?)", [id, username]);
      await pool.query("UPDATE posts SET likes = likes + 1 WHERE id=?", [id]);
      // เพิ่ม notification เฉพาะถ้า like คนอื่น
      if (post.username !== username) {
        await addNotification({
          id: Date.now(),
          type: "like",
          sender: username,
          recipient: post.username,
          postId: post.id,
          text: null,
          timestamp: new Date(),
        });
      }
      res.json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// API สำหรับแก้ไขโพสต์
app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    let updateSql = "UPDATE posts SET caption=?";
    let params = [caption];
    if (req.file) {
      updateSql += ", image=?";
      params.push(`/uploads/${req.file.filename}`);
    }
    updateSql += " WHERE id=?";
    params.push(id);
    await pool.query(updateSql, params);
    const [rows] = await pool.query("SELECT * FROM posts WHERE id=?", [id]);
    res.json({ message: "Post updated successfully", post: rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

//;/ API สำหรับลบโพสต์
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id=?", [id]);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

/// save post api
app.post('/api/posts/:id/toggle-save', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const [saved] = await pool.query("SELECT * FROM post_saves WHERE post_id=? AND username=?", [id, username]);
    if (saved.length > 0) {
      await pool.query("DELETE FROM post_saves WHERE post_id=? AND username=?", [id, username]);
      res.json({ isSaved: false });
    } else {
      await pool.query("INSERT INTO post_saves (post_id, username) VALUES (?, ?)", [id, username]);
      res.json({ isSaved: true });
    }
  } catch (error) {
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

    const [postRows] = await pool.query("SELECT * FROM posts WHERE id=?", [id]);
    const post = postRows[0];
    if (!post) return res.status(404).json({ error: "Post not found" });

    const commentId = Date.now();
    await pool.query(
      "INSERT INTO post_comments (id, post_id, username, text, timestamp) VALUES (?, ?, ?, ?, ?)",
      [commentId, id, username, text, new Date()]
    );

    // เพิ่ม notification เฉพาะถ้า comment คนอื่น
    if (post.username !== username) {
      await addNotification({
        id: Date.now(),
        type: "comment",
        sender: username,
        recipient: post.username,
        postId: post.id,
        text,
        timestamp: new Date(),
      });
    }

    // ดึงคอมเมนต์ล่าสุดทั้งหมด
    const [comments] = await pool.query("SELECT * FROM post_comments WHERE post_id=? ORDER BY timestamp ASC", [id]);
    res.json({ message: "Comment added successfully", comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// endpost

// profile----------------------------------------------------------------------------------

// Get all profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM profiles");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to read profiles data" });
  }
});

// Get a specific profile by username
app.get("/api/profiles/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await pool.query("SELECT * FROM profiles WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, bio, website } = req.body;
    await pool.query(
      "UPDATE profiles SET fullName=?, bio=?, website=? WHERE id=?",
      [fullName, bio, website, id]
    );
    const [rows] = await pool.query("SELECT * FROM profiles WHERE id=?", [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add avatar upload endpoint
app.put('/api/profiles/:id/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatarPath = `/avatars/${req.file.filename}`;
    await pool.query("UPDATE profiles SET avatar=? WHERE id=?", [avatarPath, id]);
    const [rows] = await pool.query("SELECT * FROM profiles WHERE id=?", [id]);
    res.json(rows[0]);
  } catch (error) {
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

//end profile

// login/register----------------------------------------------------------------------------------

// API สำหรับบันทึกข้อมูลผู้ใช้
app.post("/api/register", async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const [dup] = await pool.query("SELECT * FROM profiles WHERE username=? OR email=?", [username, email]);
    if (dup.length > 0) return res.status(400).json({ error: "Username or email already exists" });
    await pool.query(
      "INSERT INTO profiles (username, fullName, email, password, avatar, bio, website) VALUES (?, ?, ?, ?, ?, '', '')",
      [username, fullName, email, password, "/avatars/placeholder-person.jpg"]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error); // เพิ่มบรรทัดนี้เพื่อดู error จริง
    res.status(500).json({ error: "Failed to save profile data" });
  }
});


// API สำหรับตรวจสอบข้อมูลการเข้าสู่ระบบ
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM profiles WHERE (LOWER(username)=? OR LOWER(email)=?) AND password=?",
      [identifier.toLowerCase(), identifier.toLowerCase(), password]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Invalid username/email or password" });
    const user = rows[0];
    delete user.password;
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
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
    const [a, b] = [user1, user2].sort();
    const [convs] = await pool.query(
      "SELECT id FROM conversations WHERE user1_sorted=? AND user2_sorted=?",
      [a, b]
    );
    if (convs.length === 0) return res.json([]);
    const conversationId = convs[0].id;
    const [messages] = await pool.query(
      "SELECT * FROM messages WHERE conversation_id=? ORDER BY timestamp ASC",
      [conversationId]
    );
    res.json(messages);
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
    const conversationId = await getOrCreateConversation(sender, recipient);
    const messageId = Date.now();
    const timestamp = new Date();
    await pool.query(
      "INSERT INTO messages (id, conversation_id, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)",
      [messageId, conversationId, sender, text, timestamp]
    );
    res.status(201).json({ id: messageId, sender, text, timestamp });
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
    // ดึง id ของทั้งสอง user
    const [[toFollow]] = await pool.query("SELECT id FROM profiles WHERE username=?", [username]);
    const [[me]] = await pool.query("SELECT id FROM profiles WHERE username=?", [currentUser]);
    if (!toFollow || !me) return res.status(404).json({ error: "User not found" });

    // เช็คว่าติดตามอยู่หรือยัง
    const [rows] = await pool.query("SELECT * FROM followers WHERE user_id=? AND follower_username=?", [toFollow.id, currentUser]);
    if (rows.length > 0) {
      // unfollow
      await pool.query("DELETE FROM followers WHERE user_id=? AND follower_username=?", [toFollow.id, currentUser]);
      await pool.query("DELETE FROM following WHERE user_id=? AND following_username=?", [me.id, username]);
      res.json({ message: "Unfollowed successfully" });
    } else {
      // follow
      await pool.query("INSERT INTO followers (user_id, follower_username) VALUES (?, ?)", [toFollow.id, currentUser]);
      await pool.query("INSERT INTO following (user_id, following_username) VALUES (?, ?)", [me.id, username]);
      // เพิ่ม notification เฉพาะถ้า follow คนอื่น
      if (username !== currentUser) {
        await addNotification({
          id: Date.now(),
          type: "follow",
          sender: currentUser,
          recipient: username,
          postId: null,
          text: null,
          timestamp: new Date(),
        });
      }
      res.json({ message: "Followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle follow" });
  }
});

// Get followers
app.get("/api/profiles/:username/followers", async (req, res) => {
  try {
    const { username } = req.params;
    const [[user]] = await pool.query("SELECT id FROM profiles WHERE username=?", [username]);
    if (!user) return res.status(404).json({ error: "User not found" });
    const [rows] = await pool.query("SELECT follower_username FROM followers WHERE user_id=?", [user.id]);
    res.json(rows.map(r => r.follower_username));
  } catch (error) {
    res.status(500).json({ error: "Failed to get followers" });
  }
});

// Get following
app.get("/api/profiles/:username/following", async (req, res) => {
  try {
    const { username } = req.params;
    const [[user]] = await pool.query("SELECT id FROM profiles WHERE username=?", [username]);
    if (!user) return res.status(404).json({ error: "User not found" });
    const [rows] = await pool.query("SELECT following_username FROM following WHERE user_id=?", [user.id]);
    res.json(rows.map(r => r.following_username));
  } catch (error) {
    res.status(500).json({ error: "Failed to get following" });
  }
});

// เพิ่ม notification
const addNotification = async (notification) => {
  await pool.query(
    "INSERT INTO notifications (id, type, sender, recipient, postId, text, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      notification.id,
      notification.type,
      notification.sender,
      notification.recipient,
      notification.postId,
      notification.text || null,
      notification.timestamp,
    ]
  );
};

// API สำหรับดึง notification ของผู้ใช้
app.get("/api/notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [notifications] = await pool.query(
      "SELECT * FROM notifications WHERE recipient = ? ORDER BY timestamp DESC",
      [username]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// API สำหรับดึง notification ของผู้ใช้

app.get("/api/events", async (req, res) => {
  try {
    const [events] = await pool.query("SELECT * FROM events ORDER BY id DESC");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});


// API สำหรับสร้างอีเว้นท์
app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    if (!title || !description || !date || !time || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    const [result] = await pool.query(
      "INSERT INTO events (title, description, date, time, image) VALUES (?, ?, ?, ?, ?)",
      [title, description, date, time, imagePath]
    );
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Event created successfully", event: rows[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});
app.put("/api/events/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time } = req.body;

    let updateSql = "UPDATE events SET title=?, description=?, date=?, time=?";
    let params = [title, description, date, time];

    if (req.file) {
      updateSql += ", image=?";
      params.push(`/uploads/${req.file.filename}`);
    }

    updateSql += " WHERE id=?";
    params.push(id);

    await pool.query(updateSql, params);

    const [rows] = await pool.query("SELECT * FROM events WHERE id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event updated successfully", event: rows[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM events WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });
    await pool.query("DELETE FROM events WHERE id=?", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

async function getOrCreateConversation(userA, userB) {
  const [a, b] = [userA, userB].sort();
  // ค้นหา
  const [rows] = await pool.query(
    "SELECT id FROM conversations WHERE user1_sorted=? AND user2_sorted=?",
    [a, b]
  );
  if (rows.length > 0) return rows[0].id;
  // สร้างใหม่
  const [result] = await pool.query(
    "INSERT INTO conversations (user1, user2, user1_sorted, user2_sorted) VALUES (?, ?, ?, ?)",
    [userA, userB, a, b]
  );
  return result.insertId;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});