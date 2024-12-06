'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  fieldType?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  fieldType = "input"
}) => {
  // Function to auto-
  return (
    <div className="input-group mb-3">
      <label htmlFor={name} className="input-group-text">{label}</label>
      {fieldType === "input" ? (
        <input
          className="form-control"
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          spellCheck={false}
        />
      ) : (
        <div 
          contentEditable="true"
          suppressContentEditableWarning={true}
          className="form-control"
          id={name}
          onChange={(e) => {
            onChange(e);
          }}
          spellCheck={false}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default FormInput;
