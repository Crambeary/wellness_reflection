'use client';

import React, { useEffect, useRef, useState, use, type Usable } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSave, faTrash, faSpinner, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FormInput from '@/components/FormInput';
import MealSection from '@/components/MealSection';
import VitalitySection from '@/components/VitalitySection';
import ActivitySection from '@/components/ActivitySection';
import html2canvas from 'html2canvas';
import { createClient } from '@/utils/supabase/client';
import { getClientReflection, getUsersName } from '@/utils/supabase/database';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearForm, loadSavedForm, setShowModal, setTargetDate, clearName, setName, setUserId, setWasViewingClients } from '@/store/wellnessSlice';
import { mapReflectionToState } from '@/utils/mappers';
import { Dropdown } from 'react-bootstrap';
import { confirmDateSwitch } from '@/store/actions';
import { logout } from '@/login/actions';
import { getLocalISOString } from '@/utils/helpers';
import DateHeader from '@/components/DateHeader';

export default function ClientReflectionView({ params }: { params: Usable<{ id: string }> }) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.wellness);
  const captureRegionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const passedParams = use<{ id: string }>(params);

  useEffect(() => {
    if (nameRef.current && state.name && state.isAuthenticated && !state.isLoading) {
      nameRef.current.textContent = `${state.name}`;
    }
  }, [state.name, state.isAuthenticated, state.isLoading]);

  useEffect(() => {
    setIsLoading(false);

  }, []);

  useEffect(() => {
    dispatch(setUserId(passedParams.id));
    dispatch(setWasViewingClients(true));
    // This is the main function that fetches the todays reflection from the db or local storage on page load
    const fetchTodaysReflection = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch today's reflection if it exists
        const today = getLocalISOString()
        const { reflection } = await getClientReflection(state.userId, today);
        if (reflection) {
          const stateData = mapReflectionToState(reflection);
          return stateData;
        }
        return null;
      } else {
        dispatch(clearName());
        dispatch(clearForm());
        return null;
      }
    }

    const updateForm = async () => {

      try {
        const stateData = await fetchTodaysReflection();
        if (!stateData) { 
          throw new Error('No form found');
        }
        dispatch(loadSavedForm({ ...stateData, lastUpdated: new Date('0').toISOString() }));
        
      } catch (error) {
        console.error('Error updating form:', error);
      }
    }

    const getClientName = async () => {
      const name = await getUsersName(state.userId);
      dispatch(setName(name));
    }

    updateForm();
    getClientName();
  }, [dispatch]);

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

  const handleConfirmDateSwitch = () => {
    dispatch(confirmDateSwitch());
  };

  const handleConfirmLogout = () => {
    dispatch(setShowModal(false));
    logout();
  };

  const handleCancel = () => {
    dispatch(setShowModal(false));
    dispatch(setTargetDate(null));
  };

  const handleChange = (e: React.ChangeEvent<HTMLDivElement | HTMLInputElement> | React.FormEvent<HTMLDivElement>) => {
    console.error('handleChange should not be called', e);
  };

  return (
    <>
      <DateHeader isCoach={true} />
      <div style={{ position: 'relative', marginBottom: '50vh'}}>
        <section id="region-to-capture" className="container-sm" ref={captureRegionRef}>
        <div className="row">
          <div className="col-md-12" id="wellness-form" >
            <div className='row'>
              <h2 className='col-auto my-3' style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>
                {!isLoading && state.isAuthenticated && (
                  <>
                    <span>Viewing Client Info</span>
                    <br/>
                  </>
                )}
                  <span ref={nameRef} id='name' className={`fw-bold col-auto`}></span>
              </h2>
            </div>
            <div id="form">
              <FormInput
                label="Wake Time"
                id="wake-time"
                type='time'
                value={state['wake-time']}
                onChange={handleChange}
                disabled
              />
              <FormInput
                label="Last Night's Bedtime"
                id="bedtime"
                type='time'
                value={state['bedtime']}
                onChange={handleChange}
                disabled
              />
              <FormInput
                label="Quote of the Day"
                id="qotd"
                value={state.qotd}
                onChange={handleChange}
                fieldType="textarea"
                disabled
              />
              <div className='card bg-light p-3 m-1 my-3'>
                <h2>Vitality Levels</h2>
                <VitalitySection 
                  section="Hydration" 
                  value={state.hydration} 
                  onChange={handleChange} 
                  disabled
                />
              </div>
              <div className='card text-bg-light p-3 m-1 my-3'>
                <h2>Morning</h2>
                <VitalitySection 
                  section="Morning" 
                  value={state['morning-vitality']} 
                  onChange={handleChange} 
                  disabled
                />
                <ActivitySection 
                  timeOfDay="Morning" 
                  activity={state['morning-activity']}
                  onChange={handleChange} 
                  disabled
                />
                <MealSection 
                  timeOfDay="Morning" 
                  id="morning-meals"
                  meals={state['morning-meals']}
                  notes={state['morning-meals-notes']}
                  cravings={state['morning-meals-cravings']}
                  onChange={handleChange} 
                  disabled
                />
              </div>
              <div className='card text-bg-light p-3 m-1 my-3'>
                <h2>Afternoon</h2>
                <VitalitySection 
                  section="Afternoon" 
                  value={state['afternoon-vitality']} 
                  onChange={handleChange} 
                  disabled
                />
                <ActivitySection 
                  timeOfDay="Afternoon" 
                  activity={state['afternoon-activity']}
                  onChange={handleChange} 
                  disabled
                />
                <MealSection 
                  timeOfDay="Afternoon" 
                  id="afternoon-meals"
                  meals={state['afternoon-meals']}
                  notes={state['afternoon-meals-notes']}
                  cravings={state['afternoon-meals-cravings']}
                  onChange={handleChange} 
                  disabled
                />
              </div>
              <div className='card text-bg-light p-3 m-1 my-3'>
                <h2>Evening</h2>
                <VitalitySection 
                  section="Evening" 
                  value={state['evening-vitality']} 
                  onChange={handleChange} 
                  disabled
                />
                <ActivitySection 
                  timeOfDay="Evening" 
                  activity={state['evening-activity']}
                  onChange={handleChange} 
                  disabled
                />
                <MealSection 
                  timeOfDay="Evening" 
                  id="evening-meals"
                  meals={state['evening-meals']}
                  notes={state['evening-meals-notes']}
                  cravings={state['evening-meals-cravings']}
                  onChange={handleChange} 
                  disabled
                />
              </div>
              <div className="d-grid gap-2 d-md-block">
                <Dropdown data-html2canvas-ignore className="d-grid gap-2 d-md-block">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic-button" >
                    Extra Options
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <button data-html2canvas-ignore id="export-image" type="button" className="dropdown-item" onClick={generateImage}><FontAwesomeIcon icon={faDownload} /> Save Image</button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Modal show={state.showModal} onHide={() => dispatch(setShowModal(false))} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{state.modalMessage.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{state.modalMessage.body.split('\n').map((line: string, index: number) => (
                    <p key={`modal-body-${index}`}>{line}</p>
                  ))}</Modal.Body>
                  <Modal.Footer>
                    {state.modalMessage.footer === 'unsaved' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="primary" onClick={handleConfirmDateSwitch}>Continue</Button>
                      </>
                    )}
                    {state.modalMessage.footer === 'logout' && (
                      <>
                        <Button variant="secondary" onClick={handleCancel}>Close</Button>
                        <Button variant="outline-danger" onClick={handleConfirmLogout}>Log out</Button>
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
    </>
  )
}