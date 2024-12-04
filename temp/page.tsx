'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas'
import { supabase } from '../lib/supabase'

interface FormState {
  name: string;
  date: string;
  'wake-time': string;
  qotd: string;
  hydration: string;
  'morning-vitality': string;
  'afternoon-vitality': string;
  'evening-vitality': string;
  'morning-meals': string;
  'morning-meals-notes': string;
  'morning-meals-cravings': string;
  'afternoon-meals': string;
  'afternoon-meals-notes': string;
  'afternoon-meals-cravings': string;
  'evening-meals': string;
  'evening-meals-notes': string;
  'evening-meals-cravings': string;
  'morning-activity': string;
  'afternoon-activity': string;
  'evening-activity': string;
}

const defaultState: FormState = {
  name: "",
  date: "",
  'wake-time': "",
  qotd: "",
  hydration: "",
  'morning-vitality': "",
  'afternoon-vitality': "",
  'evening-vitality': "",
  'morning-meals': "",
  'morning-meals-notes': "",
  'morning-meals-cravings': "",
  'afternoon-meals': "",
  'afternoon-meals-notes': "",
  'afternoon-meals-cravings': "",
  'evening-meals': "",
  'evening-meals-notes': "",
  'evening-meals-cravings': "",
  'morning-activity': "",
  'afternoon-activity': "",
  'evening-activity': ""
}

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldType?: 'input' | 'textarea';
}

const FormInput = ({ label, type = "text", name, value, onChange, fieldType = "input" }: FormInputProps) => (
  <div className="input-group mb-3">
    <label htmlFor={name} className="input-group-text">{label}</label>
    {fieldType === "input" ? (
      <input
        className="form-control"
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    ) : (
      <textarea
        className="form-control"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
)

interface MealSectionProps {
  timeOfDay: string;
  values: FormState;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MealSection = ({ timeOfDay, values, onChange }: MealSectionProps) => (
  <div>
    <h3>{timeOfDay} Meals</h3>
    <FormInput
      label="Meals"
      name={`${timeOfDay.toLowerCase()}-meals`}
      value={values[`${timeOfDay.toLowerCase()}-meals` as keyof FormState]}
      onChange={onChange}
    />
    <FormInput
      label="Notes"
      name={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={values[`${timeOfDay.toLowerCase()}-meals-notes` as keyof FormState]}
      onChange={onChange}
    />
    <FormInput
      label="Cravings"
      name={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={values[`${timeOfDay.toLowerCase()}-meals-cravings` as keyof FormState]}
      onChange={onChange}
    />
  </div>
)

interface VitalitySectionProps {
  section: string;
  values: FormState;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VitalitySection = ({ section, values, onChange }: VitalitySectionProps) => (
  <>
    {section === "hydration" ? (
      <div className="input-group mb-3">
        <label htmlFor="hydration" className="input-group-text">Hydration:</label>
        <input
          className="form-control"
          name="hydration"
          type="number"
          pattern="[0-9]*"
          min="1"
          max="5"
          id="hydration"
          value={values.hydration}
          onChange={onChange}
        />
        <span className="input-group-text">/5</span>
      </div>
    ) : (
      <div className="input-group mb-3">
        <label htmlFor={`${section.toLowerCase()}-vitality`} className="input-group-text">{section}</label>
        <input
          className="form-control"
          name={`${section.toLowerCase()}-vitality`}
          value={values[`${section.toLowerCase()}-vitality` as keyof FormState]}
          onChange={onChange}
          type="number"
          pattern="[0-9]*"
          min="1"
          max="5"
        />
        <span className="input-group-text">/5</span>
      </div>
    )}
  </>
)

interface ActivitySectionProps {
  timeOfDay: string;
  values: FormState;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ActivitySection = ({ timeOfDay, values, onChange }: ActivitySectionProps) => (
  <div className="input-group mb-3">
    <label htmlFor={`${timeOfDay.toLowerCase()}-activity`} className="input-group-text">{timeOfDay}:</label>
    <textarea
      className="form-control"
      name={`${timeOfDay.toLowerCase()}-activity`}
      id={`${timeOfDay.toLowerCase()}-activity`}
      value={values[`${timeOfDay.toLowerCase()}-activity` as keyof FormState]}
      onChange={onChange}
    />
  </div>
)

export default function AppPage() {
  const [formState, setFormState] = useState<FormState>(defaultState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // First try to get from localStorage for offline support
    const retreivedObject = localStorage.getItem('form');
    if (retreivedObject) {
      setFormState(JSON.parse(retreivedObject));
    }
    
    // Then try to fetch the latest from Supabase
    fetchLatestEntry();
  }, []);

  const fetchLatestEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const latestEntry = data[0];
        setFormState(latestEntry);
        localStorage.setItem('form', JSON.stringify(latestEntry));
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prev => {
      const newState = { ...prev, [name]: value };
      localStorage.setItem('form', JSON.stringify(newState));
      return newState;
    });
  };

  const clearForm = () => {
    localStorage.clear();
    setFormState(defaultState);
    setIsSubmitted(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!isSubmitted) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const formJSON = Object.fromEntries(formData.entries());

        // Save to Supabase
        const { error } = await supabase
          .from('wellness_entries')
          .insert([{ ...formJSON, created_at: new Date().toISOString() }]);

        if (error) throw error;

        // Hide inputs and show values
        Object.keys(formJSON).forEach(key => {
          const element = document.getElementById(key);
          if (element) {
            element.classList.add("d-none");
            const label = element.previousElementSibling as HTMLElement;
            if (label) {
              const inputSpan = document.createElement("span");
              inputSpan.id = `input-for-${key}`;
              inputSpan.classList.add("border", "border-2", "rounded", "p-2", "lh-lg");
              label.parentElement?.appendChild(inputSpan);
              inputSpan.innerText = ` ${formJSON[key]}`;
            }
          }
        });

        setIsSubmitted(true);

        // Generate and download image
        const captureRegion = document.getElementById("region-to-capture");
        if (captureRegion) {
          const canvas = await html2canvas(captureRegion);
          const dataURL = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `Wellness_Reflection.png`;
          link.click();
        }
      } else {
        clearForm();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Daily Wellness Reflection</h1>
      <form onSubmit={handleSubmit} id="wellness-form">
        <div id="region-to-capture">
          <FormInput label="Name" name="name" value={formState.name} onChange={handleChange} />
          <FormInput label="Date" type="date" name="date" value={formState.date} onChange={handleChange} />
          <FormInput label="Wake Time" type="time" name="wake-time" value={formState['wake-time']} onChange={handleChange} />
          <FormInput label="Question of the Day" name="qotd" value={formState.qotd} onChange={handleChange} fieldType="textarea" />
          
          <div className="vitality-section">
            <h3>Vitality</h3>
            <VitalitySection section="hydration" values={formState} onChange={handleChange} />
            <VitalitySection section="Morning" values={formState} onChange={handleChange} />
            <VitalitySection section="Afternoon" values={formState} onChange={handleChange} />
            <VitalitySection section="Evening" values={formState} onChange={handleChange} />
          </div>

          <div className="meals-section">
            <MealSection timeOfDay="Morning" values={formState} onChange={handleChange} />
            <MealSection timeOfDay="Afternoon" values={formState} onChange={handleChange} />
            <MealSection timeOfDay="Evening" values={formState} onChange={handleChange} />
          </div>

          <div className="activity-section">
            <h3>Activity</h3>
            <ActivitySection timeOfDay="Morning" values={formState} onChange={handleChange} />
            <ActivitySection timeOfDay="Afternoon" values={formState} onChange={handleChange} />
            <ActivitySection timeOfDay="Evening" values={formState} onChange={handleChange} />
          </div>
        </div>
        
        <button type="submit" id="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : isSubmitted ? 'Edit Form' : <><FontAwesomeIcon icon={faDownload}/> Generate</>}
        </button>
      </form>
    </div>
  );
}