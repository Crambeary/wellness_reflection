const submitButton = document.getElementById("submit")
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
  } else { // Now it's a reset button
    location.reload()
  }



}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
