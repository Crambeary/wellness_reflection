'use client';

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas';

let formIsSubmitted = false;
let submitButton = "";
let wellnessForm = "";
let form = "";
let captureRegion = "";

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

const FormInput = ({ label, type = "text", name, value, onChange, fieldType = "input"}) => (
  <div className="input-group mb-3">
    <label htmlFor={name} className="input-group-text">{label}</label>
    { fieldType === "input" ? (
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
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

const MealSection = ({ timeOfDay, values, onChange }) => (
  <div>
    <h3>{timeOfDay} Meals</h3>
    <FormInput
      label="Meals"
      name={`${timeOfDay.toLowerCase()}-meals`}
      value={values[`${timeOfDay.toLowerCase()}-meals`]}
      onChange={onChange}
    />
    <FormInput
      label="Notes"
      name={`${timeOfDay.toLowerCase()}-meals-notes`}
      value={values[`${timeOfDay.toLowerCase()}-meals-notes`]}
      onChange={onChange}
    />
    <FormInput
      label="Cravings"
      name={`${timeOfDay.toLowerCase()}-meals-cravings`}
      value={values[`${timeOfDay.toLowerCase()}-meals-cravings`]}
      onChange={onChange}
    />
  </div>
);

const VitalitySection = ({ section, values, onChange }) => {
  const name = section === "Hydration" ? "hydration" : `${section.toLowerCase()}-vitality`;
  return (
    <div className="input-group mb-3">
      <label htmlFor={name} className="input-group-text">{section}</label>
      <input
        className="form-control text-start"
        name={name}
        id={name}
        value={values[name]}
        onChange={onChange}
        type="number"
        pattern="[0-9]*"
        min="1"
        max="5"
        style={{ textAlign: 'left' }}
      />
      <span id={`${name}-scale`} className="input-group-text">/5</span>
    </div>
  );
};

const ActivitySection = ({ timeOfDay, values, onChange }) => (
  <div className="input-group mb-3">
    <label htmlFor={`${timeOfDay.toLowerCase()}-activity`} className="input-group-text">{timeOfDay}:</label>
    <textarea
      className="form-control"
      name={`${timeOfDay.toLowerCase()}-activity`}
      id={`${timeOfDay.toLowerCase()}-activity`}
      value={values[`${timeOfDay.toLowerCase()}-activity`]}
      onChange={onChange}
    />
  </div>
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  handleChange = (event) => {
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
      form.requestSubmit(submitButton);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!formIsSubmitted) {
      const data = new FormData(event.target);
      const formJSON = Object.fromEntries(data.entries());

      for (const [key, value] of Object.entries(formJSON)) {
        const element = document.getElementById(String(key));
        const scaleElement = document.getElementById(`${key}-scale`);
        if (element) {
          element.classList.add("d-none");
          const inputSpan = document.createElement("span");
          inputSpan.setAttribute("id", `input-for-${key}`);
          inputSpan.classList.add("border", "border-2", "rounded", "p-2", "lh-lg");
          if (element.label?.parentElement) {
            element.label.parentElement.appendChild(inputSpan).innerText = ` ${value}`;
          }
        }
        if (scaleElement) {
          scaleElement.classList.add("d-none");
        }
      }

      submitButton.innerText = "Edit Form";
      formIsSubmitted = true;

      try {
        const canvas = await html2canvas(captureRegion, {
          logging: false,
          useCORS: true,
          scale: 2
        });

        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `Wellness_Reflection_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to generate image:", error);
        alert("Failed to generate image. Please try again.");
      }
    } else {
      formIsSubmitted = false;
      submitButton.innerHTML = '<FontAwesomeIcon icon={faDownload}/> Generate';
      const data = new FormData(event.target);
      const formJSON = Object.fromEntries(data.entries());
      
      for (const [key, value] of Object.entries(formJSON)) {
        const element = document.getElementById(String(key));
        const scaleElement = document.getElementById(`${key}-scale`);
        if (element) {
          element.classList.remove("d-none");
          const inputSpan = document.getElementById(`input-for-${key}`);
          if (inputSpan && element.label?.parentElement) {
            element.label.parentElement.removeChild(inputSpan);
          }
        }
        if (scaleElement) {
          scaleElement.classList.remove("d-none");
        }
      }
    }
  }

  componentDidMount() {
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    captureRegion = document.getElementById("region-to-capture");

    let labels = document.getElementsByTagName('LABEL');
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].htmlFor != '') {
        var elem = document.getElementById(labels[i].htmlFor);
        if (elem)
          elem.label = labels[i];
      }
    }

    let retrievedObject = localStorage.getItem('form');
    if (retrievedObject) {
      this.setState(JSON.parse(retrievedObject));
    }

    form.addEventListener('submit', this.handleSubmit);
  }

  render() {
    return (
      <div style={{ position: 'relative', marginBottom: '100vh' }}>
        <section id="region-to-capture" className="container-sm">
          <h1 className="text-center">Wellness Reflection</h1>
          <div className="row">
            <div className="col-md-12" id="wellness-form" >
              <h2>How are you lately?</h2>
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
                <h2>Activities</h2>
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
            height: '100vh',
            width: '100%',
            position: 'absolute',
            bottom: '-100vh'
          }}
        />
      </div>
    )
  }
}
