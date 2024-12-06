'use client';

import React from 'react';

interface ActivitySectionProps {
  timeOfDay: string;
  activity: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ timeOfDay, activity, onChange }) => {
  // Function to auto-resize textarea
  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="input-group mb-3">
      <label htmlFor={`${timeOfDay.toLowerCase()}-activity`} className="input-group-text">{timeOfDay}:</label>
      <textarea
        className="form-control"
        name={`${timeOfDay.toLowerCase()}-activity`}
        id={`${timeOfDay.toLowerCase()}-activity`}
        value={activity}
        onChange={(e) => {
          onChange(e);
          handleInput(e);
        }}
        onInput={handleInput}
        spellCheck={false}
      />
    </div>
  );
};

export default ActivitySection;
