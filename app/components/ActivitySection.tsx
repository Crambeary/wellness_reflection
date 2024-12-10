'use client';

import React from 'react';
import FormInput from '@/components/FormInput';

interface ActivitySectionProps {
  timeOfDay: string;
  activity: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ timeOfDay, activity, onChange}) => {
  return (
    <FormInput
      label={`${timeOfDay} Activity`}
      id={`${timeOfDay.toLowerCase()}-activity`}
      value={activity}
      onChange={onChange}
      fieldType='textarea'
    />
  );
};

export default ActivitySection;
