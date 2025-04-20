import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventDetails.css";

const EventDetails = () => {
  const { eventId } = useParams(); // รับ eventId จาก URL
  const [event, setEvent] = useState(null);

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
      }
    };

    fetchEvent();
  }, [eventId]);

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
      <div className="event-details-content">
        <h1 className="event-details-title">{event.title}</h1>
        <p className="event-details-description">{event.description}</p>
        <p className="event-details-date">Date: {event.date}</p>
      </div>
    </div>
  );
};

export default EventDetails;