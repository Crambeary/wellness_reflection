'use client';

import React from 'react';
import FormInput from './FormInput';

interface MealSectionProps {
  timeOfDay: string;
  meals: string;
  notes: string;
  cravings: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
  id: string;
  disabled?: boolean;
}

const MealSection: React.FC<MealSectionProps> = ({ 
  timeOfDay, 
  meals, 
  notes, 
  cravings, 
  onChange, 
  id,
  disabled=false
}) => (
  <div>
    <FormInput
      label="Meals"
      id={`${timeOfDay.toLowerCase()}-meals`}
      value={meals}
      onChange={onChange}
      fieldType='textarea'
      disabled={disabled}
    />
    <FormInput
      label="Cravings"
      id={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={cravings}
      onChange={onChange}
      fieldType='textarea'
      disabled={disabled}
    />
    <FormInput
      label="Notes"
      id={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={notes}
      onChange={onChange}
      fieldType='textarea'
      disabled={disabled}
    />
  </div>
);

export default MealSection;
