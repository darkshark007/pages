function makeDataPackage() {
  return {
    'version': 1,
    'name': "",
    'author': "",
    'url': "",
    'ingredients': [],
    'steps': [],
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

function buildDataPackage() {
  console.log('[R] called buildDataPackage');
  let nameElement = window.document.getElementById('name');
  let parsedData = makeDataPackage();
  parsedData['name'] = nameElement.value;
  // parsedData['author'] = data['author'];
  // parsedData['url'] = data['url'];
  // parsedData['ingredients'] = data['ingredients'];
  // parsedData['steps'] = data['steps'];
  return parsedData;
}

function exportDataPackage() {
  console.log('[R] called exportDataPackage');
  let url = new URL(window.location.href);
  let data = buildDataPackage();
  let encoded = btoa(JSON.stringify(data))
  url.searchParams.append('d', encoded);
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

function buildForm() {
  console.log('[R] called buildForm');
  let form = window.document.createElement('FORM');
  let nameElement = window.document.createElement('INPUT');
  form.appendChild(nameElement);
  nameElement.type='TEXT';
  nameElement.id='name';
  nameElement.addEventListener("change", exportDataPackage);

  
  // Set up based on the current form version
  nameElement.value=data['name'];

  console.log(window);
  console.log(window.document);
  console.log(window.document.body);
  window.document.body.appendChild(form);
}

// Main
window.onload = function onload() {
  console.log('[R] called onload');
  buildForm();
  exportDataPackage();
}
