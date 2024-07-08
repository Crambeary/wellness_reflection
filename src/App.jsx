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

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = defaultState;
  }


  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value}, () => {
      localStorage.setItem('form', JSON.stringify(this.state));
    });
  }


  clearForm = () => {
    localStorage.clear();
    for (const [key, value] of Object.entries(this.state)) {
      this.setState({[key]: ""});
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
        inputSpan.classList.add("input-group-text");
        document.getElementById(String(key)).label.appendChild(inputSpan).innerText = ` ${formJSON[String(key)]}`;
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
        link.download = "Wellness Reflection.png";

        var downloadButton = document.createElement("button");
        downloadButton.id = "downloadBtn";
        downloadButton.classList.add("max-width");
        downloadButton.innerText = "Download";

        // Append to document
        wellnessForm.appendChild(link);
        // wellnessForm.appendChild(downloadButton);

        // document.getElementById('downloadBtn').addEventListener('click', function() {
        document.getElementById('hiddenLink').click();
        // });
        // alert("Send the downloaded form to Destiny.")
      });
    } else { // Now it's a reset button
      formIsSubmitted = false;
      submitButton.innerText = "Submit";
      const data = new FormData(event.target);

      const formJSON = Object.fromEntries(data.entries());
      for (const [key, value] of Object.entries(formJSON)) {
        document.getElementById(String(key)).classList.remove("d-none");
        const inputSpan = document.getElementById(String(key)).label.lastChild;
        document.getElementById(String(key)).label.removeChild(inputSpan);
      }

      // wellnessForm.removeChild(wellnessForm.lastChild)
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

  render () {
    return (
      <section id="region-to-capture" className="container-sm">
        <h1 className="text-center">Wellness Reflection</h1>
        <div className="row">
          <div className="col-md-12" id="wellness-form" >
            <h2>How are you lately?</h2>
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="clear" type="button" className="btn btn-primary" onClick={this.clearForm}>New Form</button>
              </div>
            <form id="form">
              <div className="row">
                <label className="col" htmlFor="name">Name: 
                  <input 
                    className="form-control" 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </label>
                <label className="col" htmlFor="date">Date: 
                  <input 
                    className="form-control" 
                    type="date" 
                    name="date" 
                    id="date" 
                    value={this.state.date}
                    onChange={this.handleChange}
                  />
                </label>
                <label className="col" htmlFor="wake-time">Wake Time: 
                  <input 
                    className="form-control" 
                    type="text" 
                    name="wake-time" 
                    id="wake-time"
                    value={this.state['wake-time']}
                    onChange={this.handleChange}
                  />
                </label>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="qotd">Verse/Quote of the Day: </label>
                </div>
                <div className="row">
                  <div className="col">
                    <textarea 
                      className="form-control" 
                      name="qotd" 
                      type="text" 
                      id="qotd"
                      value={this.state.qotd}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
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
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals"><strong>Morning:</strong> </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="morning-meals" 
                  name="morning-meals"
                  value={this.state['morning-meals']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals-notes">Notes: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="morning-meals-notes" 
                  name="morning-meals-notes"
                  value={this.state['morning-meals-notes']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals-cravings">Cravings: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="morning-meals-cravings" 
                  name="morning-meals-cravings"
                  value={this.state['morning-meals-cravings']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals"><strong>Afternoon:</strong> </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="afternoon-meals" 
                  name="afternoon-meals"
                  value={this.state['afternoon-meals']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals-notes">Notes: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="afternoon-meals-notes" 
                  name="afternoon-meals-notes"
                  value={this.state['afternoon-meals-notes']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals-cravings">Cravings: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="afternoon-meals-cravings" 
                  name="afternoon-meals-cravings"
                  value={this.state['afternoon-meals-cravings']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals"><strong>Evening:</strong> </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="evening-meals" 
                  name="evening-meals"
                  value={this.state['evening-meals']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals-notes">Notes: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="evening-meals-notes" 
                  name="evening-meals-notes"
                  value={this.state['evening-meals-notes']}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals-cravings">Cravings: </label>
                <input 
                  className="form-control" 
                  type="text" 
                  id="evening-meals-cravings" 
                  name="evening-meals-cravings"
                  value={this.state['evening-meals-cravings']}
                  onChange={this.handleChange}
                />
              </div>
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
                <button data-html2canvas-ignore id="submit" type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faDownload}/> Generate</button>
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
