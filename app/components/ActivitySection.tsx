'use client';

import React from 'react';
import FormInput from '@/components/FormInput';

interface ActivitySectionProps {
  timeOfDay: string;
  activity: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ timeOfDay, activity, onChange, disabled=false }) => {
  return (
    <FormInput
      label="Activity"
      id={`${timeOfDay.toLowerCase()}-activity`}
      value={activity}
      onChange={onChange}
      fieldType='textarea'
      disabled={disabled}
    />
  );
};

export default ActivitySection;
