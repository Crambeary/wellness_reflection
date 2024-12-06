'use client';

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import FormInput from './components/FormInput';
import MealSection from './components/MealSection';
import VitalitySection from './components/VitalitySection';
import ActivitySection from './components/ActivitySection';
import html2canvas from 'html2canvas';
import { createClient } from '@/utils/supabase/client';

let formIsSubmitted = false;
let submitButton: HTMLElement | null = null;
let wellnessForm: HTMLElement | null = null;
let form: HTMLFormElement | null = null;
let captureRegion: HTMLElement | null = null;

let defaultState = {
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

class App extends React.Component {
  state = defaultState;

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
        localStorage.setItem('form', JSON.stringify(this.state));
    });
  }

  clearForm = () => {
    localStorage.clear();
    for (const [key, value] of Object.entries(this.state)) {
      this.setState({ [key]: "" });
    }
    if (formIsSubmitted) {
      form?.requestSubmit(submitButton);
    }
  }

  handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;

      try {
        if (captureRegion instanceof HTMLElement) {
          await html2canvas(captureRegion)
          .then((canvas) => {
            const dataUrl = canvas.toDataURL('image/png');
            return dataUrl;
          })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `Wellness_Reflection_${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        } else {
          throw new Error('Capture region not found');
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
        alert("Failed to generate image. Please try again.");
      }
  }

  async componentDidMount() {
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    captureRegion = document.getElementById("region-to-capture");

    let retrievedObject = localStorage.getItem('form');
    if (retrievedObject) {
      this.setState(JSON.parse(retrievedObject));
    }

    form?.addEventListener('submit', this.handleSubmit);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      this.setState({ name: user.user_metadata.full_name });
    }
  }

  render() {
    return (
      <div style={{ position: 'relative', marginBottom: '50vh' }}>
        <section id="region-to-capture" className="container-sm">
          <h1 className="text-center">Wellness Reflection</h1>
          <div className="row">
            <div className="col-md-12" id="wellness-form" >
              <h2>How are you lately{this.state.name ? `, ${this.state.name}` : ''}?</h2>
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="clear" type="button" className="btn btn-primary m-2" onClick={this.clearForm}>New Form</button>
              </div>
              <form id="form">
                <FormInput
                  label="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  />
                <FormInput
                  label="Date"
                  name="date"
                  type="date"
                  value={this.state.date}
                  onChange={this.handleChange}
                  />
                <FormInput
                  label="Wake Time"
                  name="wake-time"
                  value={this.state['wake-time']}
                  onChange={this.handleChange}
                  />
                <FormInput
                  label="Quote of the Day"
                  name="qotd"
                  value={this.state.qotd}
                  onChange={this.handleChange}
                  fieldType="textarea"
                  />
                <h2>Vitality Levels</h2>
                <VitalitySection section="Hydration" values={this.state} onChange={this.handleChange} />
                <VitalitySection section="Morning" values={this.state} onChange={this.handleChange} />
                <VitalitySection section="Afternoon" values={this.state} onChange={this.handleChange} />
                <VitalitySection section="Evening" values={this.state} onChange={this.handleChange} />
                <h2>Meals + Supplements + Beverages</h2>
                <MealSection timeOfDay="Morning" values={this.state} onChange={this.handleChange} />
                <MealSection timeOfDay="Afternoon" values={this.state} onChange={this.handleChange} />
                <MealSection timeOfDay="Evening" values={this.state} onChange={this.handleChange} />
                <h3>Daily Activities</h3>
                <ActivitySection timeOfDay="Morning" values={this.state} onChange={this.handleChange} />
                <ActivitySection timeOfDay="Afternoon" values={this.state} onChange={this.handleChange} />
                <ActivitySection timeOfDay="Evening" values={this.state} onChange={this.handleChange} />
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
}

export default App;
