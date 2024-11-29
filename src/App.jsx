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


class App extends React.Component {

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
    // document.forms['form'].submit();

  }


  handleSubmit = (event) => {
    event.preventDefault();



    if (!formIsSubmitted) {
      const data = new FormData(event.target);

      const formJSON = Object.fromEntries(data.entries());

      console.log(JSON.stringify(formJSON, null, 2));

      for (const [key, value] of Object.entries(formJSON)) {
        document.getElementById(String(key)).classList.add("d-none");
        const inputSpan = document.createElement("span");
        inputSpan.setAttribute("id", `input-for-${key}`);
        inputSpan.classList.add("border", "border-2", "rounded", "p-2", "lh-lg");
        // inputSpan.classList.add("overflow-auto");
        document.getElementById(String(key)).label.parentElement.appendChild(inputSpan).innerText = ` ${formJSON[String(key)]}`;
      }

      submitButton.innerText = "Edit Form";
      formIsSubmitted = true;
      html2canvas(captureRegion).then(function(canvas) {
        // Convert canvas to data URL
        var dataURL = canvas.toDataURL("image/png");

        // Create an image
        var img = document.createElement("img");
        img.src = dataURL;

        // Create a link
        var link = document.createElement("a");
        link.href = dataURL;
        link.id = "hiddenLink";
        link.download = `Wellness_Reflection.png`;

        var downloadButton = document.createElement("button");
        downloadButton.id = "downloadBtn";
        downloadButton.classList.add("max-width");
        downloadButton.innerText = "Download";

        // Append to document
        wellnessForm.appendChild(link);
        document.getElementById('hiddenLink').click();
      });
    } else { // Now it's a reset button
      formIsSubmitted = false;
      // TODO: Create a unique button for Generate and one for Reset 
      submitButton.innerHTML = '<FontAwesomeIcon icon={faDownload}/> Generate';
      const data = new FormData(event.target);

      const formJSON = Object.fromEntries(data.entries());
      for (const [key, value] of Object.entries(formJSON)) {
        document.getElementById(String(key)).classList.remove("d-none");
        const inputSpan = document.getElementById(String(key)).label.parentElement.lastChild;
        document.getElementById(String(key)).label.parentElement.removeChild(inputSpan);
      }
    }
  }

  componentDidMount = () => {
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    // form = document.forms['form'];
    captureRegion = document.getElementById("region-to-capture");

    let labels = document.getElementsByTagName('LABEL');
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].htmlFor != '') {
        var elem = document.getElementById(labels[i].htmlFor);
        if (elem)
          elem.label = labels[i];
      }
    }


    let retreivedObject = localStorage.getItem('form');
    if (retreivedObject) {
      this.setState(JSON.parse(retreivedObject));
    } else {
      retreivedObject = defaultState;
    }



    form.addEventListener('submit', this.handleSubmit);
  }

  render() {
    return (
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
              <div className="input-group mb-3">
                <label htmlFor="hydration" className="input-group-text">Hydration:</label>
                <input
                  className="form-control"
                  type="number"
                  pattern="[0-9]*"
                  name="hydration"
                  min="1"
                  max="5"
                  id="hydration"
                  value={this.state.hydration}
                  onChange={this.handleChange}
                />
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="morning-vitality" className="input-group-text">Morning:</label>
                <input
                  className="form-control"
                  type="number"
                  pattern="[0-9]*"
                  name="morning-vitality"
                  min="1"
                  max="5"
                  id="morning-vitality"
                  value={this.state['morning-vitality']}
                  onChange={this.handleChange}
                />
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="afternoon-vitality" className="input-group-text">Afternoon:</label>
                <input
                  className="form-control"
                  type="number"
                  pattern="[0-9]*"
                  name="afternoon-vitality"
                  min="1"
                  max="5"
                  id="afternoon-vitality"
                  value={this.state['afternoon-vitality']}
                  onChange={this.handleChange}
                />
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="evening-vitality" className="input-group-text">Evening:</label>
                <input
                  className="form-control"
                  type="number"
                  pattern="[0-9]*"
                  name="evening-vitality"
                  min="1"
                  max="5"
                  id="evening-vitality"
                  value={this.state['evening-vitality']}
                  onChange={this.handleChange}
                />
                <span className="input-group-text">/5</span>
              </div>
              <h2>Meals + Supplements + Beverages</h2>
              <MealSection timeOfDay="Morning" values={this.state} onChange={this.handleChange} />
              <MealSection timeOfDay="Afternoon" values={this.state} onChange={this.handleChange} />
              <MealSection timeOfDay="Evening" values={this.state} onChange={this.handleChange} />
              <h2>Activities</h2>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-activity">Morning: </label>
                <input
                  className="form-control"
                  type="text"
                  id="morning-activity"
                  name="morning-activity"
                  value={this.state['morning-activity']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-activity">Afternoon: </label>
                <input
                  className="form-control"
                  type="text"
                  id="afternoon-activity"
                  name="afternoon-activity"
                  value={this.state['afternoon-activity']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-activity">Evening: </label>
                <input
                  className="form-control"
                  type="text"
                  id="evening-activity"
                  name="evening-activity"
                  value={this.state['evening-activity']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="submit" type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faDownload} /> Generate</button>
              </div>
            </form>
          </div>
        </div>
        {/* TODO: Add padding to bottom of page so mobile can scroll past the form 50% */}
        <span data-html2canvas-ignore className="container vh-50"></span>
      </section>
    )
  }
}

export default App
