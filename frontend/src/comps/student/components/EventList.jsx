import React, { useState } from 'react';

const EventList = () => {
  const [events] = useState([
    { id: 1, title: 'Math Exam', date: 'April 25, 10:00 AM' },
    { id: 2, title: 'Project Presentation', date: 'April 28, 11:30 AM' },
    { id: 3, title: 'Study Group Meeting', date: 'April 30, 4:00 PM' },
  ]);

  return (
    <div className="events">
      <h3>Upcoming Events</h3>
      <ul>
        {events.map(e => (
          <li key={e.id}>{e.title} - {e.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
