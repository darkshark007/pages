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

let contentContainer = null;
let buttonView = null;
let buttonEdit = null;
let viewElement = null;
let formElement = null;
let nameFormElement = null;
let authorFormElement = null;
let urlFormElement = null;
let ingredientsFormElement = null;
let stepsFormElement = null;
function buildPage() {
  console.log('[R] called buildPage');
  contentContainer = window.document.getElementById('contentContainer');
  buttonView = window.document.getElementById('buttonView');
  buttonEdit = window.document.getElementById('buttonEdit');
  buttonView.addEventListener('click', mountView);
  buttonEdit.addEventListener('click', mountEdit);
  formElement = window.document.createElement('FORM');
  formElement.action='';
  formElement.onsubmit="event.preventDefault();";
  function addFormElement(name, title, type) {

    let newFormElement = null;
    if (type === "TEXT") newFormElement = window.document.createElement('INPUT');
    if (type === "TEXTAREA") newFormElement = window.document.createElement('textarea');
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
  urlFormElement = addFormElement('url', 'URL:', 'TEXT');
  ingredientsFormElement = addFormElement('ingredients', 'Ingredients:', 'TEXTAREA');
  stepsFormElement = addFormElement('steps', 'Steps:', 'TEXTAREA');
  
  // Set up form based on the current form version
  nameFormElement.value=data['name'];
  authorFormElement.value=data['author'];
  urlFormElement.value=data['url'];
  ingredientsFormElement.value=data['ingredients'];
  stepsFormElement.value=data['steps'];

  // Build the View Element
  viewElement = window.document.createElement('DIV');

  
  mountView();
}

function mountView() {
  console.log('[R] called mountView');
  let parsedData = buildDataPackage();

  let ingredientStepHtml = '';
  let ingredientRows = parsedData['ingredients'].split('\n');
  let stepRows = parsedData['steps'].split('\n');
  let rowCount = Math.max(8, ingredientRows.length, stepRows.length);

  function makeDynamicRow(ingredient, step) {
    ingredientStepHtml += `
      <tr style="border-bottom: 1px solid navy">
        <td>
          ${ingredient}
        </td>
        <td>
          ${step}
        </td>
      </tr>
    `;
  }

  for (let idx = 0; idx < rowCount; idx++) {
    let nextIngredient = ingredientRows[idx] || "";
    let nextStep = stepRows[idx] || "";
    makeDynamicRow(nextIngredient, nextStep);
  }

  viewElement.innerHTML = `
    <div>
      <table id="recipeTable">
        <tr style="border-bottom: 2px solid salmon">
          <td>
            "${parsedData['name']}" from ${parsedData['author']}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid navy">
          <td>
            <a href="${parsedData['url']}" style="font-size: small;">${parsedData['url']}</a>
          </td>
        </tr>
        ${ingredientStepHtml}
      </table>
    </div>
  `
  for (let child of contentContainer.children) {
    contentContainer.removeChild(child);
  }
  contentContainer.appendChild(viewElement);
}

function mountEdit() {
  console.log('[R] called mountEdit');
  for (let child of contentContainer.children) {
    contentContainer.removeChild(child);
  }
  contentContainer.appendChild(formElement);
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
  buildPage();
  exportDataPackage();
}
