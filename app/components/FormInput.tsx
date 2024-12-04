'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  fieldType?: 'input' | 'textarea';
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  fieldType = "input"
}) => {
  // Function to auto-resize textarea
  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

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
        <textarea
          className="form-control"
          name={name}
          id={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            handleInput(e);
          }}
          onInput={handleInput}
          spellCheck={false}
        />
      )}
    </div>
  );
};

export default FormInput;
