import React from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import './styles.css'
import html2canvas from 'html2canvas';
    
let formIsSubmitted = false;
let submitButton = "";
let wellnessForm = "";
let form = "";
let captureRegion = "";

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (!formIsSubmitted) {
      const data = new FormData(event.target);

      const formJSON = Object.fromEntries(data.entries());

      console.log(JSON.stringify(formJSON, null, 2));

      for (const [key, value] of Object.entries(formJSON)) {
        document.getElementById(String(key)).classList.add("hidden");
        const inputSpan = document.createElement("span");
        inputSpan.setAttribute("id", `input-for-${key}`);
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
        document.getElementById(String(key)).classList.remove("hidden");
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
      <section id="region-to-capture">
        <h1>Wellness Reflection</h1>
        <div className="container" id="wellness-form" >
          <h2>How are you lately?</h2>
          <form id="form">
            <label htmlFor="name">Name: <input type="text" name="name" id="name" /> </label>
            <label htmlFor="date">Date: <input type="date" name="date" id="date" /> </label>
            <label htmlFor="wake-time">Wake Time: <input type="text" name="wake-time" id="wake-time" /> </label>
            <div className="block"><label htmlFor="qotd">Verse/Quote of the Day: <br/><input name="qotd" className="block max-width" type="text" id="qotd"/> </label></div> <h2>Vitality Levels</h2>
            <label htmlFor="hydration" className="inline">Hydration: <input type="number" pattern="[0-9]*"name="hydration"  min="1" max="5" id="hydration"/></label><p className="inline">/5</p><br/>
            <label htmlFor="morning-vitality"className="inline">Morning: <input type="number" pattern="[0-9]*"name="morning-vitality"  min="1" max="5" id="morning-vitality"/></label><p className="inline">/5</p><br/>
            <label htmlFor="afternoon-vitality"className="inline">Afternoon: <input type="number" pattern="[0-9]*"name="afternoon-vitality"  min="1" max="5" id="afternoon-vitality"/></label><p className="inline">/5</p><br/>
            <label htmlFor="evening-vitality"className="inline">Evening: <input type="number" pattern="[0-9]*"name="evening-vitality"  min="1" max="5" id="evening-vitality"/></label><p className="inline">/5</p><br/>
            <h2>Meals + Supplements + Beverages</h2>
            <label htmlFor="morning-meals"><strong>Morning:</strong> <input type="text" id="morning-meals" name="morning-meals"  /> </label>
            <label htmlFor="morning-meals-notes">Notes: <input type="text" id="morning-meals-notes" name="morning-meals-notes"/> </label>
            <label htmlFor="morning-meals-cravings">Cravings: <input type="text" id="morning-meals-cravings" name="morning-meals-cravings"/> </label>
            <label htmlFor="afternoon-meals"><strong>Afternoon:</strong> <input type="text" id="afternoon-meals"  name="afternoon-meals"/> </label>
            <label htmlFor="afternoon-meals-notes">Notes: <input type="text" id="afternoon-meals-notes" name="afternoon-meals-notes"/> </label>
            <label htmlFor="afternoon-meals-cravings">Cravings: <input type="text" id="afternoon-meals-cravings" name="afternoon-meals-cravings"/> </label>
            <label htmlFor="evening-meals"><strong>Evening:</strong> <input type="text" id="evening-meals"  name="evening-meals"/> </label>
            <label htmlFor="evening-meals-notes">Notes: <input type="text" id="evening-meals-notes" name="evening-meals-notes"/> </label>
            <label htmlFor="evening-meals-cravings">Cravings: <input type="text" id="evening-meals-cravings" name="evening-meals-cravings"/> </label>
            <h2>Activities</h2>
            <label htmlFor="morning-activity">Morning: <input type="text" id="morning-activity" name="morning-activity"/> </label>
            <label htmlFor="afternoon-activity">Afternoon: <input type="text" id="afternoon-activity" name="afternoon-activity"/> </label>
            <label htmlFor="evening-activity">Evening: <input type="text" id="evening-activity" name="evening-activity"/> </label>
            <button data-html2canvas-ignore id="submit" className="max-width">Generate</button>
          </form>
        </div>
        <span data-html2canvas-ignore className="margin-bottom"></span>
      </section>
    )
  }
}

export default App
