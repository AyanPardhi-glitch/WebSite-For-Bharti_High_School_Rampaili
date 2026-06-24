import React from 'react';

const CourseCard = ({ title, progress }) => {
  return (
    <div className="course-card">
      <h3>{title}</h3>
      <p>Progress: {progress}%</p>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} className="progress"></div>
      </div>
    </div>
  );
};

export default CourseCard;
