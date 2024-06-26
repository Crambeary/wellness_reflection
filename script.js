const submitButton = document.getElementById("submit");
const wellnessForm = document.getElementById("wellness-form");
const form = document.querySelector('form');
const captureRegion = document.getElementById("region-to-capture");

let formIsSubmitted = false;

var labels = document.getElementsByTagName('LABEL');
for (var i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor != '') {
         var elem = document.getElementById(labels[i].htmlFor);
         if (elem)
            elem.label = labels[i];         
    }
}

function handleSubmit(event) {
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

form.addEventListener('submit', handleSubmit);
