'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementField, decrementField, setFieldValue } from '../store/wellnessSlice';
import { RootState } from '../store/store';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputButton from './ui/InputButton';

interface VitalityData {
  0: JSX.Element;
  1: JSX.Element;
  2: JSX.Element;
  3: JSX.Element;
  4: JSX.Element;
  5: JSX.Element;
}

const emojiHydration: VitalityData = {
  0: <></>,
  1: <><FontAwesomeIcon icon={faDroplet} className="me-1" /></>,
  2: <><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /></>,
  3: <><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /></>,
  4: <><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /></>,
  5: <><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /><FontAwesomeIcon icon={faDroplet} className="me-1" /></>
};

const emojiVitality: VitalityData = {
  0: <></>,
  1: <><FontAwesomeIcon icon={faFire} className="me-1" /></>,
  2: <><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /></>,
  3: <><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /></>,
  4: <><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /></>,
  5: <><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /><FontAwesomeIcon icon={faFire} className="me-1" /></>
};

const emojiMap = {
  hydration: emojiHydration,
  'morning-vitality': emojiVitality,
  'afternoon-vitality': emojiVitality,
  'evening-vitality': emojiVitality
};

interface VitalitySectionProps {
  section: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const VitalitySection: React.FC<VitalitySectionProps> = ({ section, value, onChange, disabled=false }) => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isLoading = useSelector((state: RootState) => state.wellness.isLoading);
  
  const storeValue = useSelector((state: RootState) => {
    const scale = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
    return state.wellness[scale as keyof typeof state.wellness];
  });
  
  const scale = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
  const value_key = storeValue as keyof VitalityData;
  const scale_key = scale as keyof typeof emojiMap;

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and before mounting, show a simplified structure
  if (!mounted) {
    return (
      <div className="input-group mb-3 row">
        <div className="form-label col-auto me-auto">
          <label htmlFor={scale}>
            {section} {section === "Hydration" ? "Level" : "Vitality"}: 0
          </label>
        </div>
        <span className='col-auto p-0'></span>
        <span className='row p-0'>
          <InputButton className='mx-3' disabled>-</InputButton>
          <input
            type="range"
            className="form-range slider col"
            value="0"
            disabled
          />
          <InputButton className='ms-3' disabled>+</InputButton>
        </span>
      </div>
    );
  }

  return (
    <div className="input-group mb-3 row">
      <div className="form-label col-auto me-auto">
        <label htmlFor={scale}>
          {section} {section === "Hydration" ? "Level" : "Vitality"}: {storeValue?.toString() || '0'}
        </label>
      </div>
      <span className='col-auto p-0'>{emojiMap[scale_key][value_key]}</span>
      <span className='row p-0'>
        <InputButton 
          onClick={() => dispatch(decrementField(scale))} 
          className='mx-3'
          disabled={disabled || isLoading}
        >
          -
        </InputButton>
        <input
          data-html2canvas-ignore
          type="range"
          className={`form-range slider col`}
          min="0"
          max="5"
          step="1"
          id={scale}
          value={storeValue?.toString() || '0'}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            dispatch(setFieldValue({ 
              id: scale, 
              value: newValue 
            }));
          }}
          disabled={disabled}
        />
        <InputButton 
          onClick={() => dispatch(incrementField(scale))} 
          className='ms-3'
          disabled={disabled || isLoading}
        >
          +
        </InputButton>
      </span>
    </div>
  );
};

export default VitalitySection;
