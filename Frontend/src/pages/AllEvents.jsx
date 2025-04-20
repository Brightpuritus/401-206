import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import "./AllEvents.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // ใช้สำหรับการนำทาง

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

  return (
    <div className="all-events-container">
      <h1>All Events</h1>
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="event-item"
              onClick={() => navigate(`/events/${event.id}`)} // เพิ่มการนำทาง
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
                <p className="event-location">Location: {event.location}</p>
                <p className="event-time">Time: {event.time}</p>
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