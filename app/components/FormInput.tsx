'use client';

import React, { useEffect, useRef } from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  value: string;
  fieldType?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = "text", 
  id, 
  value, 
  onChange, 
  fieldType = "input",
  disabled = false
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
            disabled={disabled}
          />
          {type === 'time' && (
            <button className='btn btn-outline-danger' onClick={() => {
              console.log('clearing');
              onChange({ target: { id, value: '' } } as React.ChangeEvent<HTMLInputElement>);
              }}
              disabled={disabled}
              >
              X
            </button>
          )}
        </div>
      ) : (
        <div className="mb-3">
          <label htmlFor={id} className="form-label">{label}</label>
          <div 
            ref={contentRef}
            contentEditable={!disabled}
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
