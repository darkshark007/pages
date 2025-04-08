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
  let nameElement = document.getElementById('name');
  let parsedData = makeDataPackage();
  parsedData['name'] = nameElement.value;
  // parsedData['author'] = data['author'];
  // parsedData['url'] = data['url'];
  // parsedData['ingredients'] = data['ingredients'];
  // parsedData['steps'] = data['steps'];
  return parsedData;
}

function exportDataPackage() {
  let params = new URL(window.location.href);
  let data = buildDataPackage();
  let encoded = atob(data);
  params.searchParams.append('d', encoded);
}

let params = new URLSearchParams(document.location.search);
let data = parseDataPackage(params.get("d"));

function buildForm() {
  let form = document.createElement('FORM');
  let nameElement = document.createElement('INPUT');
  form.appendChild(nameElement);
  nameElement.type='TEXT';
  nameElement.name='name';
  nameElement.id='name';
  nameElement.onchange=exportDataPackage;

  
  // Set up based on the current form version
  nameElement.value=data['name'];

  window.document.appendChild(form);
}
