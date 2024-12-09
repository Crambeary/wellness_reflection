'use client';

import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import FormInput from './components/FormInput';
import MealSection from './components/MealSection';
import VitalitySection from './components/VitalitySection';
import ActivitySection from './components/ActivitySection';
import html2canvas from 'html2canvas';
import { createClient } from '@/utils/supabase/client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { updateField, clearForm, loadSavedForm, setLoading } from './store/wellnessSlice';

let formIsSubmitted = false;
let submitButton: HTMLElement | null = null;
let wellnessForm: HTMLElement | null = null;
let form: HTMLFormElement | null = null;
let captureRegion: HTMLElement | null = null;

export default function App() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.wellness);

  useEffect(() => {
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    captureRegion = document.getElementById("region-to-capture");

    let retrievedObject = localStorage.getItem('form');
    if (retrievedObject) {
      dispatch(loadSavedForm(JSON.parse(retrievedObject)));
    } else {
      dispatch(setLoading(false));
    }

    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(updateField({ id: 'name', value: user.user_metadata.full_name }));
      }
    };
    
    fetchUser();
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement> | React.FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLDivElement;
    let value: string | number;
    
    // Handle numeric fields
    if (target instanceof HTMLInputElement && (
      target.id === 'hydration' ||
      target.id === 'morning-vitality' ||
      target.id === 'afternoon-vitality' ||
      target.id === 'evening-vitality'
    )) {
      value = parseInt(target.value) || 0;
    } 
    // Handle all other fields as strings
    else if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      value = target.value;
    } else {
      value = target.textContent || '';
    }

    const id = target.id;
    
    if (id) {
      dispatch(updateField({ id, value }));
      const currentForm = {
        ...state,
        [id]: value
      };
      localStorage.setItem('form', JSON.stringify(currentForm));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captureRegion) return;

    try {
      const canvas = await html2canvas(captureRegion);
      const dataUrl = canvas.toDataURL();
      const link = document.createElement('a');
      const formattedDate = state.date || 'undated';
      link.download = `wellness-reflection-${formattedDate}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const clearFormHandler = () => {
    dispatch(clearForm());
    localStorage.removeItem('form');
  };

  return (
    <div style={{ position: 'relative', marginBottom: '50vh' }}>
      <section id="region-to-capture" className="container-sm">
        <h1 className="text-center">Wellness Reflection</h1>
        <div className="row">
          <div className="col-md-12" id="wellness-form" >
            <div className='row'>
              <h2 className='text-muted col-auto'>
                How are you lately{state.name ? ', ' : ''}
                {state.name && (
                  <div id='name' className={`fw-bold col-auto`}>
                    {state.name ? `${state.name}?` : ''}
                  </div>
                )}
                {state.name ? '' : '?'}
              </h2>
            </div>
            <div className="d-grid gap-2 d-md-block">
              <button data-html2canvas-ignore id="clear" type="button" className="btn btn-primary m-2" onClick={clearFormHandler}>New Form</button>
            </div>
            <form id="form" onSubmit={handleSubmit}>
              <FormInput
                label="Name"
                id="name"
                value={state.name}
                onChange={handleChange}
              />
              <FormInput
                label="Date"
                id="date"
                type="date"
                value={state.date}
                onChange={handleChange}
              />
              <FormInput
                label="Wake Time"
                id="wake-time"
                type='time'
                value={state['wake-time']}
                onChange={handleChange}
              />
              <FormInput
                label="Quote of the Day"
                id="qotd"
                value={state.qotd}
                onChange={handleChange}
                fieldType="textarea"
              />
              <h2>Vitality Levels</h2>
              <VitalitySection 
                section="Hydration" 
                value={state.hydration} 
                onChange={handleChange} 
              />
              <VitalitySection 
                section="Morning" 
                value={state['morning-vitality']} 
                onChange={handleChange} 
              />
              <VitalitySection 
                section="Afternoon" 
                value={state['afternoon-vitality']} 
                onChange={handleChange} 
              />
              <VitalitySection 
                section="Evening" 
                value={state['evening-vitality']} 
                onChange={handleChange} 
              />
              <h2>Meals + Supplements + Beverages</h2>
              <MealSection 
                timeOfDay="Morning" 
                id="morning-meals"
                meals={state['morning-meals']}
                notes={state['morning-meals-notes']}
                cravings={state['morning-meals-cravings']}
                onChange={handleChange} 
              />
              <MealSection 
                timeOfDay="Afternoon" 
                id="afternoon-meals"
                meals={state['afternoon-meals']}
                notes={state['afternoon-meals-notes']}
                cravings={state['afternoon-meals-cravings']}
                onChange={handleChange} 
              />
              <MealSection 
                timeOfDay="Evening" 
                id="evening-meals"
                meals={state['evening-meals']}
                notes={state['evening-meals-notes']}
                cravings={state['evening-meals-cravings']}
                onChange={handleChange} 
              />
              <h3>Daily Activities</h3>
              <ActivitySection 
                timeOfDay="Morning" 
                activity={state['morning-activity']}
                onChange={handleChange} 
              />
              <ActivitySection 
                timeOfDay="Afternoon" 
                activity={state['afternoon-activity']}
                onChange={handleChange} 
              />
              <ActivitySection 
                timeOfDay="Evening" 
                activity={state['evening-activity']}
                onChange={handleChange} 
              />
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="submit" type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faDownload} /> Generate</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <div
        data-html2canvas-ignore 
        style={{ 
          height: '50vh',
          width: '100%',
          position: 'absolute',
          bottom: '-50vh'
        }}
      />
    </div>
  )
}
