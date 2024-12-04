'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldType?: 'input' | 'textarea';
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  fieldType = "input"
}) => (
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
      />
    ) : (
      <textarea
        className="form-control"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

export default FormInput;
