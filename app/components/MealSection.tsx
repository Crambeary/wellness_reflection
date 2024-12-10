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
}

const MealSection: React.FC<MealSectionProps> = ({ 
  timeOfDay, 
  meals, 
  notes, 
  cravings, 
  onChange 
}) => (
  <div>
    <h4>{timeOfDay} Meals</h4>
    <FormInput
      label="Meals"
      id={`${timeOfDay.toLowerCase()}-meals`}
      value={meals}
      onChange={onChange}
      fieldType='textarea'
    b-3 />
    <FormInput
      label="Notes"
      id={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={notes}
      onChange={onChange}
      fieldType='textarea'
    />
    <FormInput
      label="Cravings"
      id={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={cravings}
      onChange={onChange}
      fieldType='textarea'
    />
  </div>
);

export default MealSection;
