function makeDataPackage() {
  return {
    'version': 1,
    'name': "",
    'author': "",
    'url': "",
    'ingredients': "",
    'steps': "",
  };
}

function parseDataPackage(data) {
  console.log('[R] called parseDataPackage');
  let parsedData = makeDataPackage();
  if (!data) return parsedData;

  if (data['version'] === 1) {
    parsedData['name'] = data['name'];
    parsedData['author'] = data['author'];
    parsedData['url'] = data['url'];
    parsedData['ingredients'] = data['ingredients'];
    parsedData['steps'] = data['steps'];
  }
  return parsedData;
}


function exportDataPackage() {
  console.log('[R] called exportDataPackage');
  let url = new URL(window.location.href);
  let data = buildDataPackage();
  let encoded = btoa(JSON.stringify(data))
  console.log(`[R] encoded: ${encoded}`);
  url.searchParams.set('d', encoded);
  window.history.pushState({}, '', url);
}

let params = new URLSearchParams(window.document.location.search);
let raw = params.get("d");
console.log('raw data:');
console.log(raw)
if (raw) {
 raw = JSON.parse(atob(raw));
}
let data = parseDataPackage(raw);

let formElement = null;
let nameFormElement = null;
let authorFormElement = null;
let urlFormElement = null;
let ingredientsFormElement = null;
let stepsFormElement = null;
function buildForm() {
  console.log('[R] called buildForm');
  formElement = window.document.createElement('FORM');
  formElement.action='';
  formElement.onsubmit="event.preventDefault();";
  function addFormElement(name, title, type) {

    let newFormElement = window.document.createElement('INPUT');
    newFormElement.type=type;
    newFormElement.id=name;
    newFormElement.addEventListener("change", exportDataPackage);
    newFormElement.addEventListener("keyup", exportDataPackage);

    let newTitleElement = window.document.createElement('DIV');
    newTitleElement.innerText = title;

    let newContainerElement = window.document.createElement('DIV');
    newContainerElement.appendChild(newTitleElement);
    newContainerElement.appendChild(newFormElement);
    formElement.appendChild(newContainerElement);
    return newFormElement;
  }
  nameFormElement = addFormElement('name', 'Name:', 'TEXT');
  authorFormElement = addFormElement('author', 'Author:', 'TEXT');
  urlFormElement = addFormElement('author', 'URL:', 'TEXT');
  ingredientsFormElement = addFormElement('author', 'Ingredients:', 'TEXTAREA');
  stepsFormElement = addFormElement('author', 'Steps:', 'TEXTAREA');
  
  // Set up form based on the current form version
  nameFormElement.value=data['name'];

  window.document.body.appendChild(formElement);
}

function buildDataPackage() {
  console.log('[R] called buildDataPackage');
  let parsedData = makeDataPackage();
  parsedData['name'] = nameFormElement.value;
  parsedData['author'] = authorFormElement.value;
  parsedData['url'] = urlFormElement.value;
  parsedData['ingredients'] = ingredientsFormElement.value;
  parsedData['steps'] = stepsFormElement.value;
  return parsedData;
}

// Main
window.onload = function onload() {
  console.log('[R] called onload');
  buildForm();
  exportDataPackage();
}
