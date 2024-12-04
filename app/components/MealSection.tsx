'use client';

import React from 'react';
import FormInput from './FormInput';

interface MealSectionProps {
  timeOfDay: string;
  values: {
    [key: string]: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MealSection: React.FC<MealSectionProps> = ({ timeOfDay, values, onChange }) => (
  <div>
    <h3>{timeOfDay} Meals</h3>
    <FormInput
      label="Meals"
      name={`${timeOfDay.toLowerCase()}-meals`}
      value={values[`${timeOfDay.toLowerCase()}-meals`]}
      onChange={onChange}
    />
    <FormInput
      label="Notes"
      name={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={values[`${timeOfDay.toLowerCase()}-meals-notes`]}
      onChange={onChange}
    />
    <FormInput
      label="Cravings"
      name={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={values[`${timeOfDay.toLowerCase()}-meals-cravings`]}
      onChange={onChange}
    />
  </div>
);

export default MealSection;
