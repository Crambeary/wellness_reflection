'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  value: string;
  fieldType?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = "text", 
  id, 
  value, 
  onChange, 
  fieldType = "input"
}) => {
  return (
    <div className="input-group mb-3">
      <label htmlFor={id} className="input-group-text">{label}</label>
      {fieldType === "input" ? (
        <input
          className="form-control"
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          spellCheck={false}
        />
      ) : (
        <div 
          contentEditable="true"
          suppressContentEditableWarning={true}
          className="form-control"
          id={id}
          onBlur={(e) => {
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
