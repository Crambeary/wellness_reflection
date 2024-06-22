
function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  const formJSON = Object.fromEntries(data.entries());

  console.log(JSON.stringify(formJSON, null, 2));


}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
