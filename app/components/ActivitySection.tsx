'use client';

import React from 'react';

interface ActivitySectionProps {
  timeOfDay: string;
  activity: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ timeOfDay, activity, onChange }) => {
  return (
    <div className="input-group mb-3">
      <label htmlFor={`${timeOfDay.toLowerCase()}-activity`} className="input-group-text">{timeOfDay}:</label>
      <div
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="form-control"
        id={`${timeOfDay.toLowerCase()}-activity`}
        spellCheck={false}
      >
        {activity}
      </div>
    </div>
  );
};

export default ActivitySection;
