import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllEvents.css";

const AllEvents = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    // เพิ่มการยืนยันก่อนลบ
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) {
      return; // หากผู้ใช้กดยกเลิก จะไม่ดำเนินการลบ
    }

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

      // อัปเดต state หลังจากลบสำเร็จ
      setEvents(events.filter((event) => event.id !== eventId));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`); // เปลี่ยนเส้นทางไปยัง EventDetails พร้อมส่ง eventId
  };

  const handleEdit = (event) => {
    setEditingEvent(event); // ตั้งค่าอีเว้นท์ที่ต้องการแก้ไข
  };

  const handleSaveEdit = async (updatedEvent) => {
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

      const updatedEvents = events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
      setEditingEvent(null); // ปิดฟอร์มแก้ไข
      console.log("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  return (
    <div className="all-events-container">
      <h1>All Events</h1>
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="event-item"
              onClick={() => handleEventClick(event.id)} // เพิ่ม onClick เพื่อเปลี่ยนเส้นทาง
              style={{ cursor: "pointer" }} // เพิ่ม cursor pointer เพื่อแสดงว่าเป็นลิงก์
            >
              <img
                src={`http://localhost:5000${event.image}`}
                alt={event.title}
                className="event-image"
              />
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <p className="event-date">Date: {event.date}</p>
                <p className="event-time">Time: {event.time}</p>
                {currentUser?.username === "admin" && (
                  <div className="admin-actions">
                    <button
                      className="edit-event-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการเรียก handleEventClick
                        handleEdit(event);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-event-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการเรียก handleEventClick
                        handleDelete(event.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
      {editingEvent && (
        <div className="edit-event-form">
          <h2>Edit Event</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(editingEvent);
            }}
          >
            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              value={editingEvent.description}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="date"
              value={editingEvent.date}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
            />
            <input
              type="time"
              value={editingEvent.time}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, time: e.target.value })
              }
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

export default AllEvents;