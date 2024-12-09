'use client';

import React, { useEffect, useState } from 'react';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '@/store/hooks';
import InputButton from './ui/InputButton';

interface VitalitySectionProps {
  section: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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

const VitalitySection: React.FC<VitalitySectionProps> = ({ section, value, onChange }) => {
  const isLoading = useAppSelector((state) => state.wellness.isLoading);
  const [mounted, setMounted] = useState(false);
  const scale = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
  const [currentValue, setCurrentValue] = useState(value);
  const value_key = currentValue as keyof VitalityData;
  const scale_key = scale as keyof typeof emojiMap;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleIncrement = () => {
    if (currentValue < 5) {
      setCurrentValue(currentValue + 1);
    }
  };

  const handleDecrement = () => {
    if (currentValue > 0) {
      setCurrentValue(currentValue - 1);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="input-group mb-3 row">
        <div className="col-auto me-auto">
          <div className="placeholder-glow">
            <span className="placeholder col-12" style={{ width: '120px', height: '24px' }}></span>
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="placeholder-glow">
                <span className="placeholder" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></span>
              </div>
            ))}
          </div>
        </div>
        <div className="row w-100">
          <div className="col">
            <div className="placeholder-glow mt-2">
              <span className="placeholder col-12" style={{ height: '8px' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="input-group mb-3 row">
      <label htmlFor={scale} className="form-label col-auto me-auto">{section}: {currentValue}</label>
      <span className='col-auto p-0'>{emojiMap[scale_key][value_key]}</span>
      <span className='row p-0'>
        <InputButton onClick={handleDecrement} className='mx-3'>-</InputButton>
        <input data-html2canvas-ignore type="range" className={`form-range slider col`} min="0" max="5" step="1" id={scale} value={currentValue} onChange={onChange}></input>
        <InputButton onClick={handleIncrement} className='ms-3'>+</InputButton>
      </span>
    </div>
  );
};

export default VitalitySection;
