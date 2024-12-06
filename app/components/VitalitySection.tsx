'use client';

import React from 'react';

interface VitalitySectionProps {
  section: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VitalitySection: React.FC<VitalitySectionProps> = ({ section, value, onChange }) => {
  const name = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
  return (
    <div className="input-group mb-3">
      <label htmlFor={name} className="input-group-text">{section}</label>
      <input
        className="form-control text-start"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        type="number"
        min="1"
        max="5"
      />
      <div className="input-group-text" id={`${name}-scale`}>/5</div>
    </div>
  );
};

export default VitalitySection;
