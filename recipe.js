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
  let params = new URL(window.location.href);
  let data = buildDataPackage();
  let encoded = atob(data);
  params.searchParams.append('d', encoded);
}

let params = new URLSearchParams(window.document.location.search);
let data = parseDataPackage(params.get("d"));

function buildForm() {
  console.log('[R] called buildForm');
  let form = window.document.createElement('FORM');
  let nameElement = window.document.createElement('INPUT');
  form.appendChild(nameElement);
  nameElement.type='TEXT';
  nameElement.name='name';
  nameElement.id='name';
  nameElement.onchange=exportDataPackage;

  
  // Set up based on the current form version
  nameElement.value=data['name'];

  window.document.body.appendChild(form);
}

// Main
buildForm();
exportDataPackage();
