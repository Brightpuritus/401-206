import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css";
import "./allEvents.css";

const EventDetails = ({ currentUser }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setEvent(null);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = () => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0], // แปลงวันที่เป็น YYYY-MM-DD
      time: event.time,
      imageFile: null, // ตั้งค่าเริ่มต้นเป็น null เพราะยังไม่ได้เลือกไฟล์ใหม่
    });
    setImageFile(null);
  };

  const handleSaveEdit = async () => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (!confirmSave) return;

    try {
      const formData = new FormData();
      formData.append("title", editingEvent.title);
      formData.append("description", editingEvent.description);
      formData.append("date", editingEvent.date);
      formData.append("time", editingEvent.time);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent.event); // อัปเดตข้อมูลใน state
      setEditingEvent(null); // ปิดฟอร์มแก้ไข
      console.log("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-details-container">
      <img
        src={`http://localhost:5000${event.image}`}
        alt={event.title}
        className="event-details-image"
      />
      {event && (
        <div className="event-details-content">
          <h1 className="event-details-title">{event.title}</h1>
          <p className="event-details-description">{event.description}</p>
          <p className="event-details-date">Date: {event.date}</p>
          <p className="event-details-time">Time: {event.time}</p>
        </div>
      )}
      {currentUser?.username === "admin" && (
        <div className="fixed-buttons">
        <div className="admin-actions">
          <button className="edit-event-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-event-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
        </div>
      )}
      {editingEvent && (
        <>
          {/* พื้นหลังมืด */}
          <div className="popup-overlay" onClick={() => setEditingEvent(null)}></div>

          {/* ฟอร์มแก้ไข */}
          <div className="post-event-container">
            <h1>Edit Event</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="post-event-form"
            >
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={editingEvent.title || ""}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={editingEvent.description || ""}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, description: e.target.value })
                }
                required
              />
              <input
                type="date"
                name="date"
                value={editingEvent.date || ""}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <input
                type="time"
                name="time"
                value={editingEvent.time || ""}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, time: e.target.value })
                }
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditingEvent(null)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetails;