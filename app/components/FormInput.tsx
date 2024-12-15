'use client';

import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';

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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && fieldType === "textarea") {
      contentRef.current.textContent = value;
    }
  }, [value, fieldType]);

  return (
    <>
      {fieldType === "input" ? (
        <div className="input-group mb-3">
          <label htmlFor={id} className="input-group-text">{label}</label>
          <input
            className="form-control"
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="mb-3">
          <label htmlFor={id} className="form-label">{label}</label>
          <div 
            ref={contentRef}
            contentEditable="true"
            suppressContentEditableWarning={true}
            className="form-control"
            id={id}
            onBlur={(e) => {
              onChange(e);
            }}
            spellCheck={false}
          />
        </div>
      )}
    </>
  );
};

export default FormInput;
