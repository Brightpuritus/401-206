import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostEvent.css";

const PostEvent = ({ currentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image: null,
  });
  const [error, setError] = useState("");

  // ตรวจสอบ role ของผู้ใช้
  if (currentUser.username !== "admin") {
    return <p>Access denied. Only admins can post events.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("time", formData.time);
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to post event");
      }

      const data = await response.json();
      navigate("/events");
    } catch (error) {
      setError("Failed to post event. Please try again.");
    }
  };

  return (
    <div className="post-event-container">
      <h1>Post a New Event</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="post-event-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Post Event</button>
      </form>
    </div>
  );
};

export default PostEvent;