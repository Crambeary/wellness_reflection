'use client';

import React from 'react';

interface ActivitySectionProps {
  timeOfDay: string;
  values: {
    [key: string]: string;
  };
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ timeOfDay, values, onChange }) => (
  <div className="input-group mb-3">
    <label htmlFor={`${timeOfDay.toLowerCase()}-activity`} className="input-group-text">{timeOfDay}:</label>
    <textarea
      className="form-control"
      name={`${timeOfDay.toLowerCase()}-activity`}
      id={`${timeOfDay.toLowerCase()}-activity`}
      value={values[`${timeOfDay.toLowerCase()}-activity`]}
      onChange={onChange}
      spellCheck={false}
    />
  </div>
);

export default ActivitySection;
