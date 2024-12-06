'use client';

import React from 'react';
import FormInput from './FormInput';

interface MealSectionProps {
  timeOfDay: string;
  meals: string;
  notes: string;
  cravings: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
}

const MealSection: React.FC<MealSectionProps> = ({ 
  timeOfDay, 
  meals, 
  notes, 
  cravings, 
  onChange 
}) => (
  <div>
    <h3>{timeOfDay} Meals</h3>
    <FormInput
      label="Meals"
      name={`${timeOfDay.toLowerCase()}-meals`}
      value={meals}
      onChange={onChange}
      fieldType='textarea'
    />
    <FormInput
      label="Notes"
      name={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={notes}
      onChange={onChange}
      fieldType='textarea'
    />
    <FormInput
      label="Cravings"
      name={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={cravings}
      onChange={onChange}
      fieldType='textarea'
    />
  </div>
);

export default MealSection;
