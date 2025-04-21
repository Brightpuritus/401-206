import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllEvents.css";

const AllEvents = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
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

      setEvents(events.filter((event) => event.id !== eventId));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="all-events-container">
      <h1>All Events</h1>
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-item">
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
                {currentUser.role === "admin" && (
                  <button
                    className="delete-event-btn"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;