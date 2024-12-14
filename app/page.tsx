'use client';

import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSave, faTrash, faSpinner, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import FormInput from './components/FormInput';
import MealSection from './components/MealSection';
import VitalitySection from './components/VitalitySection';
import ActivitySection from './components/ActivitySection';
import html2canvas from 'html2canvas';
import { createClient } from '@/utils/supabase/client';
import { upsertWellnessReflection, getTodaysReflection } from '@/utils/supabase/database';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { updateField, clearForm, loadSavedForm, setLoading, setFieldValue, setDate, setSaveButton, setErrorMessage, setShowModal, setModalMessage, setIsDiverged, setTargetDate, clearName } from './store/wellnessSlice';
import { debounce } from 'lodash';
import { mapReflectionToState } from '@/utils/mappers';
import { Dropdown } from 'react-bootstrap';
import { confirmDateSwitch } from './store/actions';
import { login, logout } from './login/actions';

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
      } else {
        dispatch(clearName());
        dispatch(clearForm());
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
        } else if (isNaN(dbDate.getTime()) && savedForm.length > 0) {
          console.log('loading from local form');
          dispatch(loadSavedForm({ ...state, ...savedForm, isLoading: false }));
        } else if (isNaN(formDate.getTime()) && isNaN(dbDate.getTime())) {
          console.log('clearing form 1');
          dispatch(clearForm());
          dispatch(setDate(new Date().toISOString()));
        } else if (dbDate > formDate && stateData) {
          console.log('loading from db');
          dispatch(loadSavedForm({ ...state, ...stateData, isLoading: false }));
        } else if (formDate?.toISOString() !== '' && savedForm.length > 0) {
          console.log('loading from local form 2');
          dispatch(loadSavedForm({ ...state, ...savedForm, isLoading: false }));
        } else {
          console.log('clearing form 2');
          dispatch(clearForm());
          dispatch(setDate(new Date().toISOString()));
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

  const clearFormHandler = () => {
    dispatch(setShowModal(true));
    dispatch(setModalMessage({
      title: 'Clear Form',
      body: 'Are you sure you want to clear the form?',
      footer: 'clearing',
    }));
  };

  const saveForm = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        dispatch(setShowModal(true));
        dispatch(setModalMessage({
          title: 'Save your progress',
          body: "Log in to secure your data for this and other dates. \nYour wellness data is just a click away.",
          footer: 'unauthenticated'
        }));
        console.error('User not authenticated');
        return;
      }

      dispatch(setErrorMessage(''));
      dispatch(setSaveButton({ text: 'Saving...', icon: faSpinner, variant: 'outline-primary' }));
      const { reflection, error } = await upsertWellnessReflection(state, user.id);
      if (error) {
        console.error('Error saving reflection:', error);
        dispatch(setSaveButton({ text: 'Error', icon: faXmark, variant: 'outline-danger' }));
        dispatch(setErrorMessage(`Error saving: ${error instanceof Error ? error.message : 'Unknown error'}`));
        setTimeout(() => {
          dispatch(setSaveButton({ text: 'Submit', icon: faSave, variant: 'primary' }));
        }, 2000);
        return;
      } else if (reflection && reflection.length > 0) {
        dispatch(setSaveButton({ text: 'Saved', icon: faCheck, variant: 'outline-success' }));
        dispatch(setIsDiverged(false));
        setTimeout(() => {
          dispatch(setSaveButton({ text: 'Submit', icon: faSave, variant: 'primary' }));
        }, 2000);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConfirmDateSwitch = () => {
    dispatch(confirmDateSwitch());
  };

  const handleConfirmLogin = () => {
    login();
  };

  const handleConfirmLogout = () => {
    dispatch(setShowModal(false));
    logout();
  };

  const handleCancel = () => {
    dispatch(setShowModal(false));
    dispatch(setTargetDate(null));
  };

  const handleConfirmClear = () => {
    dispatch(setShowModal(false));
    dispatch(clearForm());
    localStorage.removeItem('form');
  };

  return (
    <div style={{ position: 'relative', marginBottom: '50vh'}}>
      <section id="region-to-capture" className="container-sm" ref={captureRegionRef}>
        <div className="row">
          <div className="col-md-12" id="wellness-form" >
            <div className='row'>
              <h2 className='text-muted col-auto my-3'style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>
                How are you lately{state.name ? ', ' : ''}
                {state.name && (
                  <div id='name' className={`fw-bold col-auto`}>
                    {state.name ? `${state.name}?` : ''}
                  </div>
                )}
                {state.name ? '' : '?'}
              </h2>
            </div>
            <div id="form">
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
              <div className='card bg-light p-3 m-1 my-3'>
                <h2>Vitality Levels</h2>
                <VitalitySection 
                  section="Hydration" 
                  value={state.hydration} 
                  onChange={handleChange} 
                />
              </div>
              <div className='card text-bg-light p-3 m-1 my-3'>
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
              <div className='card text-bg-light p-3 m-1 my-3'>
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
              <div className='card text-bg-light p-3 m-1 my-3'>
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
                <Button 
                  data-html2canvas-ignore 
                  id="save" 
                  type="button" 
                  onClick={saveForm}
                  disabled={state.saveButton.text !== 'Submit'}
                  variant={state.saveButton.variant}
                  className='mb-3'
                >
                  <FontAwesomeIcon icon={state.saveButton.icon} /> {state.saveButton.text}
                </Button>
                {state.errorMessage && (
                  <Alert data-html2canvas-ignore variant="danger" id="error-message" className='mb-3'>{state.errorMessage}</Alert>
                )}
                <Dropdown data-html2canvas-ignore className="d-grid gap-2 d-md-block">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic-button" >
                    Extra Options
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <button data-html2canvas-ignore id="export-image" type="button" className="dropdown-item" onClick={generateImage}><FontAwesomeIcon icon={faDownload} /> Save Image</button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <button data-html2canvas-ignore id="clear" type="button" className="dropdown-item" onClick={clearFormHandler}><FontAwesomeIcon icon={faTrash} /> Reset Today</button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Modal show={state.showModal} onHide={() => dispatch(setShowModal(false))} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{state.modalMessage.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{state.modalMessage.body.split('\n').map((line, index) => (
                    <p key={`modal-body-${index}`}>{line}</p>
                  ))}</Modal.Body>
                  <Modal.Footer>
                    {state.modalMessage.footer === 'unsaved' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="primary" onClick={handleConfirmDateSwitch}>Continue</Button>
                      </>
                    )}
                    {state.modalMessage.footer === 'unauthenticated' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="outline-success" onClick={handleConfirmLogin}>Log in Now</Button>
                      </>
                    )}
                    {state.modalMessage.footer === 'logout' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="outline-danger" onClick={handleConfirmLogout}>Log out</Button>
                      </>
                    )}
                    {state.modalMessage.footer === 'clearing' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="outline-danger" onClick={handleConfirmClear}>Clear</Button>
                      </>
                    )}
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
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
