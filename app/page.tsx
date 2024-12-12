'use client';

import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSave } from '@fortawesome/free-solid-svg-icons'
import FormInput from './components/FormInput';
import MealSection from './components/MealSection';
import VitalitySection from './components/VitalitySection';
import ActivitySection from './components/ActivitySection';
import html2canvas from 'html2canvas';
import { createClient } from '@/utils/supabase/client';
import { upsertWellnessReflection, getTodaysReflection } from '@/utils/supabase/database';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { updateField, clearForm, loadSavedForm, setLoading, setFieldValue } from './store/wellnessSlice';
import { debounce } from 'lodash';
import { mapReflectionToState } from '@/utils/mappers';

let formIsSubmitted = false;
let submitButton: HTMLElement | null = null;
let wellnessForm: HTMLElement | null = null;
let form: HTMLFormElement | null = null;
let captureRegion: HTMLElement | null = null;

const debouncedSave = debounce((state: any) => {
  localStorage.setItem('form', JSON.stringify(state));
}, 500);

export default function App() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.wellness);
  const captureRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    debouncedSave(state);
  }, [state]);

  useEffect(() => {
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    captureRegion = document.getElementById("region-to-capture");

    const fetchTodaysReflection = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(setFieldValue({ id: 'name', value: user.user_metadata.full_name || '' }));
        
        // Fetch today's reflection if it exists
        const { reflection } = await getTodaysReflection(user.id);
        if (reflection) {
          const stateData = mapReflectionToState(reflection);
          return stateData;
        }
        console.log('no reflection found');
        return null;
      }
    }

    const updateForm = async () => {
      const savedForm = JSON.parse(localStorage.getItem('form') || '{}');

      try {
        const stateData = await fetchTodaysReflection();
        const formDate = new Date(savedForm?.lastUpdated || '');
        const dbDate = new Date(stateData?.lastUpdated || '');
        if (isNaN(formDate.getTime()) && stateData) {
          console.log('loading from db');
          dispatch(loadSavedForm({ ...state, ...stateData, isLoading: false }));
        } else if (isNaN(dbDate.getTime()) && savedForm) {
          console.log('loading from local form');
          dispatch(loadSavedForm({ ...state, ...savedForm, isLoading: false }));
        } else if (isNaN(formDate.getTime()) && isNaN(dbDate.getTime())) {
          console.log('clearing form');
          dispatch(clearForm());
        } else if (dbDate > formDate && stateData) {
          console.log('loading from db');
          dispatch(loadSavedForm({ ...state, ...stateData, isLoading: false }));
        } else if (formDate?.toISOString() !== '' && savedForm) {
          console.log('loading from local form');
          dispatch(loadSavedForm({ ...state, ...savedForm, isLoading: false }));
        } else {
          console.log('clearing form');
          dispatch(clearForm());
        }
      } catch (error) {
        console.error('Error updating form:', error);
      }
    }

    updateForm();
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
    }
  };

  const generateImage = async () => {
    if (!captureRegionRef.current) return;
    try {
      const canvas = await html2canvas(captureRegionRef.current);
      const dataUrl = canvas.toDataURL();
      const link = document.createElement('a');
      const formattedDate = state.date || 'undated';
      link.download = `wellness-reflection-${formattedDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { reflection, error } = await upsertWellnessReflection(state, user.id);
      if (error) {
        console.error('Error saving reflection:', error);
        return;
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearFormHandler = () => {
    dispatch(clearForm());
    localStorage.removeItem('form');
  };

  return (
    <div style={{ position: 'relative', marginBottom: '50vh'}}>
      <section id="region-to-capture" className="container-sm" ref={captureRegionRef}>
        <h1 className="text-center" style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>Wellness Reflection</h1>
        <div className="row">
          <div className="col-md-12" id="wellness-form" >
            <div className='row'>
              <h2 className='text-muted col-auto'style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>
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
                label="Wake Time"
                id="wake-time"
                type='time'
                value={state['wake-time']}
                onChange={handleChange}
              />
              <FormInput
                label="Last Night's Bedtime"
                id="bedtime"
                type='time'
                value={state['bedtime']}
                onChange={handleChange}
              />
              <FormInput
                label="Quote of the Day"
                id="qotd"
                value={state.qotd}
                onChange={handleChange}
                fieldType="textarea"
              />
              <div className='card bg-light p-3 m-1'>
                <h2>Vitality Levels</h2>
                <VitalitySection 
                  section="Hydration" 
                  value={state.hydration} 
                  onChange={handleChange} 
                />
              </div>
              <div className='card text-bg-light p-3 m-1'>
                <h2>Morning</h2>
                <VitalitySection 
                  section="Morning" 
                  value={state['morning-vitality']} 
                  onChange={handleChange} 
                />
                <ActivitySection 
                  timeOfDay="Morning" 
                  activity={state['morning-activity']}
                  onChange={handleChange} 
                />
                <MealSection 
                  timeOfDay="Morning" 
                  id="morning-meals"
                  meals={state['morning-meals']}
                  notes={state['morning-meals-notes']}
                  cravings={state['morning-meals-cravings']}
                  onChange={handleChange} 
                />
              </div>
              <div className='card text-bg-light p-3 m-1'>
                <h2>Afternoon</h2>
                <VitalitySection 
                  section="Afternoon" 
                  value={state['afternoon-vitality']} 
                  onChange={handleChange} 
                />
                <ActivitySection 
                  timeOfDay="Afternoon" 
                  activity={state['afternoon-activity']}
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
              </div>
              <div className='card text-bg-light p-3 m-1'>
                <h2>Evening</h2>
                <VitalitySection 
                  section="Evening" 
                  value={state['evening-vitality']} 
                  onChange={handleChange} 
                />
                <ActivitySection 
                  timeOfDay="Evening" 
                  activity={state['evening-activity']}
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
              </div>
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="export-image" type="button" className="btn btn-primary" onClick={generateImage}><FontAwesomeIcon icon={faDownload} /> Generate</button>
                <button data-html2canvas-ignore id="save" type="submit" className="btn btn-primary" ><FontAwesomeIcon icon={faSave} /> Save</button>
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
