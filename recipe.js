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


async function exportDataPackage() {
  console.log('[R] called exportDataPackage');
  let url = new URL(window.location.href);
  let data = buildDataPackage();
  
  let encoded = window.LZString.compressToBase64(JSON.stringify(data));
  console.log(`[R] encoded: ${encoded}`);
  url.searchParams.set('d', encoded);
  window.history.pushState({}, '', url);
}

let data = null;
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
      <tr>
        <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px;" width=40%>
          ${ingredient}
        </td>
        <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px;" width=60%>
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
      <table id="recipeTable" width="700px" style="border: 1px outset black; border-radius: 2px; border-spacing: 0px; padding-left: 3px; padding-right: 3px; padding-top: 10px; padding-bottom: 5px;">
        <tr>
          <td style="border-bottom: 2px solid salmon" colspan=2>
            <span style="font-weight: bold">"${parsedData['name']}"</span> from <span style="font-style: italic;">${parsedData['author']}</span>
          </td>
        </tr>
        <tr>
          <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px;" colspan=2>
            <a href="${parsedData['url']}" style="font-size: small;">${parsedData['url']}</a>
          </td>
        </tr>
        <tr>
          <th style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px; text-align: left; text-decoration: underline;">
            Ingredients:
          </th>
          <th style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px; text-align: left; text-decoration: underline;">
            Recipe Instructions:
          </th>
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

async function gzipString(input) {
  const encoder = new TextEncoder();
  const inputStream = new Blob([encoder.encode(input)]).stream();
  const compressedStream = inputStream.pipeThrough(new CompressionStream('gzip'));
  const compressedResponse = new Response(compressedStream);
  const compressedBuffer = await compressedResponse.arrayBuffer();

  // Convert to base64 string
  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)));
  return base64;
}

async function ungzipString(base64) {
  const binaryString = atob(base64);
  const binaryData = Uint8Array.from(binaryString, c => c.charCodeAt(0));
  const inputStream = new Blob([binaryData]).stream();
  const decompressedStream = inputStream.pipeThrough(new DecompressionStream('gzip'));
  const decompressedResponse = new Response(decompressedStream);
  const text = await decompressedResponse.text();
  return text;
}

// Main
window.onload = async function onload() {
  console.log('[R] called onload');

  let params = new URLSearchParams(window.document.location.search);
  let raw = params.get("d");
  console.log('raw data:');
  console.log(raw)
  if (raw) {
    data = JSON.parse(window.LZString.decompressFromBase64(raw));
  } else {
    data = parseDataPackage();
  }
  buildPage();
  exportDataPackage();
}
