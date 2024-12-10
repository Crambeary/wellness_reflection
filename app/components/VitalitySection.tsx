import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementField, decrementField, setFieldValue } from '../store/wellnessSlice';
import { RootState } from '../store/store';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.wellness.isLoading);
  const [mounted, setMounted] = React.useState(false);
  const scale = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
  const [currentValue, setCurrentValue] = React.useState(value);
  const value_key = currentValue as keyof VitalityData;
  const scale_key = scale as keyof typeof emojiMap;

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
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
      <label htmlFor={scale} className="form-label col-auto me-auto">
        {section} {section === "Hydration" ? "Level" : "Vitality"}: {currentValue}
      </label>
      <span className='col-auto p-0'>{emojiMap[scale_key][value_key]}</span>
      <span className='row p-0'>
        <InputButton 
          onClick={() => dispatch(decrementField(scale))} 
          className='mx-3'
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
          value={currentValue}
          onChange={(e) => dispatch(setFieldValue({ 
            id: scale, 
            value: parseInt(e.target.value) 
          }))}
        />
        <InputButton 
          onClick={() => dispatch(incrementField(scale))} 
          className='ms-3'
        >
          +
        </InputButton>
      </span>
    </div>
  );
};

export default VitalitySection;
