import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas';
    
let formIsSubmitted = false;
let submitButton = "";
let wellnessForm = "";
let form = "";
let captureRegion = "";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.formObject = {}
  }


  handleChange = (event) => {
    const data = new FormData(event.target);

    formObject = Object.fromEntries(data.entries());
    console.log(formObject);
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

      submitButton.innerText = "Reset";
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
        alert("Send the downloaded form to Destiny.")
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

      wellnessForm.removeChild(wellnessForm.lastChild)
    }
  }

  componentDidMount = () => {
    
    submitButton = document.getElementById("submit");
    wellnessForm = document.getElementById("wellness-form");
    form = document.querySelector('form');
    captureRegion = document.getElementById("region-to-capture");


    var labels = document.getElementsByTagName('LABEL');
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor != '') {
            var elem = document.getElementById(labels[i].htmlFor);
            if (elem)
                elem.label = labels[i];         
        }
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
            <form id="form">
              <div className="row">
                <label className="col" htmlFor="name">Name: 
                  <input 
                    className="form-control" 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={this.formObject.name}
                    onChange={this.handleChange}
                  >{this.formObject.name}</input>
                </label>
                <label className="col" htmlFor="date">Date: 
                  <input className="form-control" type="date" name="date" id="date" />
                </label>
                <label className="col" htmlFor="wake-time">Wake Time: 
                  <input className="form-control" type="text" name="wake-time" id="wake-time" />
                </label>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="qotd">Verse/Quote of the Day: </label>
                </div>
                <div className="row">
                  <div className="col">
                    <textarea className="form-control" name="qotd" type="text" id="qotd"/> 
                  </div>
                </div>
              </div>
              <h2>Vitality Levels</h2>
              <div className="input-group mb-3">
                <label htmlFor="hydration" className="input-group-text">Hydration:</label>
                <input className="form-control" type="number" pattern="[0-9]*"name="hydration"  min="1" max="5" id="hydration"/>
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="morning-vitality" className="input-group-text">Morning:</label>
                <input className="form-control" type="number" pattern="[0-9]*"name="morning-vitality"  min="1" max="5" id="morning-vitality"/>
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="afternoon-vitality" className="input-group-text">Afternoon:</label>
                <input className="form-control" type="number" pattern="[0-9]*"name="afternoon-vitality"  min="1" max="5" id="afternoon-vitality"/>
                <span className="input-group-text">/5</span>
              </div>
              <div className="input-group mb-3">
                <label htmlFor="evening-vitality" className="input-group-text">Evening:</label>
                <input className="form-control" type="number" pattern="[0-9]*"name="evening-vitality"  min="1" max="5" id="evening-vitality"/>
                <span className="input-group-text">/5</span>
              </div>
              <h2>Meals + Supplements + Beverages</h2>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals"><strong>Morning:</strong> </label>
                <input className="form-control" type="text" id="morning-meals" name="morning-meals"  /> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals-notes">Notes: </label>
                <input className="form-control" type="text" id="morning-meals-notes" name="morning-meals-notes"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-meals-cravings">Cravings: </label>
                <input className="form-control" type="text" id="morning-meals-cravings" name="morning-meals-cravings"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals"><strong>Afternoon:</strong> </label>
                <input className="form-control" type="text" id="afternoon-meals"  name="afternoon-meals"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals-notes">Notes: </label>
                <input className="form-control" type="text" id="afternoon-meals-notes" name="afternoon-meals-notes"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-meals-cravings">Cravings: </label>
                <input className="form-control" type="text" id="afternoon-meals-cravings" name="afternoon-meals-cravings"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals"><strong>Evening:</strong> </label>
                <input className="form-control" type="text" id="evening-meals"  name="evening-meals"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals-notes">Notes: </label>
                <input className="form-control" type="text" id="evening-meals-notes" name="evening-meals-notes"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-meals-cravings">Cravings: </label>
                <input className="form-control" type="text" id="evening-meals-cravings" name="evening-meals-cravings"/> 
              </div>
              <h2>Activities</h2>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="morning-activity">Morning: </label>
                <input className="form-control" type="text" id="morning-activity" name="morning-activity"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="afternoon-activity">Afternoon: </label>
                <input className="form-control" type="text" id="afternoon-activity" name="afternoon-activity"/> 
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="evening-activity">Evening: </label>
                <input className="form-control" type="text" id="evening-activity" name="evening-activity"/> 
              </div>
              <div className="d-grid gap-2 d-md-block">
                <button data-html2canvas-ignore id="submit" className="btn btn-primary"><FontAwesomeIcon icon={faDownload}/> Generate</button>
              </div>
            </form>
          </div>
        </div>
        {/* <span data-html2canvas-ignore className="mb-1"></span> */}
      </section>
    )
  }
}

export default App
