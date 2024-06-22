const submit = document.getElementById("submit")
let form_list = {};

const addFormEntry = (form) => {
  form.preventDefault();
  form_list = {
    test: "testString",
    name: form.name.value,
    date: form.date.value,
    waketime: form.waketime.value,
    qotd: form.qotd.value
  };
  return false;
}

// submit.addEventListener("submit", submit_form);

function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  const formJSON = Object.fromEntries(data.entries());

  console.log(JSON.stringify(formJSON, null, 2));
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
