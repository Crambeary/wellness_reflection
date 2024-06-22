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

  const data = new FormData(event.target);

  const formJSON = Object.fromEntries(data.entries());

  console.log(JSON.stringify(formJSON, null, 2));

  document.getElementById("name").classList.add("hidden");
  document.getElementById("name").label.innerText += ` ${formJSON["name"]}`;
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
