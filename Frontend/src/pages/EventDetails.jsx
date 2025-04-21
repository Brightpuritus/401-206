import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css";

const EventDetails = ({ currentUser }) => {
  const { eventId } = useParams(); // รับ eventId จาก URL
  const [event, setEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setEvent(null); // ตั้งค่า event เป็น null หากเกิดข้อผิดพลาด
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser.username }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      console.log("Event deleted successfully");
      navigate("/events"); // กลับไปที่หน้า AllEvents หลังจากลบสำเร็จ
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = () => {
    setEditingEvent(event); // เปิดฟอร์มแก้ไข
  };

  const handleSaveEdit = async (updatedEvent) => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (!confirmSave) return; // หากผู้ใช้กดยกเลิก จะไม่ดำเนินการต่อ

    try {
      const response = await fetch(`http://localhost:5000/api/events/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      setEvent(updatedEvent);
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
      {currentUser?.username === "admin" && (
  <div className="admin-actions">
    <button className="edit-event-btn" onClick={handleEdit}>
      Edit
    </button>
    <button className="delete-event-btn" onClick={handleDelete}>
      Delete
    </button>
  </div>
)}
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
        </div>
      )}
      {editingEvent && (
        <div className="edit-event-form">
          <h2>Edit Event</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(editingEvent); // เรียกฟังก์ชัน handleSaveEdit พร้อมการยืนยัน
            }}
          >
            <input
              type="text"
              value={editingEvent.title || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              value={editingEvent.description || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="date"
              value={editingEvent.date || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
            />
            <input
              type="time"
              value={editingEvent.time || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, time: e.target.value })
              }
            />
            <input
              type="text"
              value={editingEvent.location || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, location: e.target.value })
              }
              placeholder="Location"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingEvent(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventDetails;