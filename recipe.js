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
  window.document.title = `Recipe Card: ${data['name']}`
}

let data = null;
let contentContainer = null;
let buttonView = null;
let buttonEdit = null;
let buttonNew = null;
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
  buttonNew = window.document.getElementById('buttonNew');
  buttonView.addEventListener('click', mountView);
  buttonEdit.addEventListener('click', mountEdit);
  setNewToConfirm();
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
  nameFormElement.size = 46;
  authorFormElement = addFormElement('author', 'Author:', 'TEXT');
  authorFormElement.size = 46;
  urlFormElement = addFormElement('url', 'URL:', 'TEXT');
  urlFormElement.size = 46;
  ingredientsFormElement = addFormElement('ingredients', 'Ingredients:', 'TEXTAREA');
  ingredientsFormElement.cols = 41;
  ingredientsFormElement.rows = 14;
  stepsFormElement = addFormElement('steps', 'Steps:', 'TEXTAREA');
  stepsFormElement.cols = 63;
  stepsFormElement.rows = 14;
  
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

let resetTimeout = null;
function setNewToConfirm() {
  console.log('[R] called setNewToConfirm');
  buttonNew.removeEventListener('click', newRecipe);
  buttonNew.addEventListener('click', setNewToReset);
  buttonNew.value = 'New Card';
}
function setNewToReset() {
  console.log('[R] called setNewToReset');
  buttonNew.removeEventListener('click', setNewToReset);
  buttonNew.addEventListener('click', newRecipe);
  buttonNew.value = 'Click again to confirm Reset';
  resetTimeout = window.setTimeout(setNewToConfirm, 5000);
}

function newRecipe() {
  console.log('[R] called newRecipe');
  window.clearTimeout(resetTimeout);
  // Set up form based on the current form version
  nameFormElement.value = '';
  authorFormElement.value = '';
  urlFormElement.value = '';
  ingredientsFormElement.value = '';
  stepsFormElement.value = '';

  exportDataPackage();
  setNewToConfirm();
  mountEdit();
}

function mountView() {
  console.log('[R] called mountView');

  function reflowText(text, size) {
      let output = [];
      let splitByParagraph = text.split("\n");
  
      function parseParagraph(p) {
          if (p.length <= size) {
              output.push(p);
              return;
          }
  
          let currentBlock = "";
          let spaceSplit = p.split(" ");
          let firstParagraph = true;
          while (true) {
              if (spaceSplit.length === 0) break;
              let targetSize = firstParagraph ? size : size-3;
              let next = currentBlock+" "+spaceSplit[0];
              if (next.length <= targetSize) {
                  currentBlock = next;
                  spaceSplit.splice(0, 1);
                  continue;
              }
              let nextOut = firstParagraph ? currentBlock.trim() : "&nbsp;&nbsp;&nbsp;"+currentBlock.trim();
              output.push(nextOut);
              currentBlock = spaceSplit[0];
              spaceSplit.splice(0, 1);
              firstParagraph = false;
          }
          let nextOut = firstParagraph ? currentBlock.trim() : "&nbsp;&nbsp;&nbsp;"+currentBlock.trim();
          output.push(nextOut);
      }
      for (let par of splitByParagraph) parseParagraph(par);
  
      return output;
  }

  function makeDynamicRow(ingredient, step) {
    ingredientStepHtml += `
      <tr style="height: 29.5px">
        <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px; font-family: monospace;" width=40%>
          ${ingredient}
        </td>
        <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px; font-family: monospace;" width=60%>
          ${step}
        </td>
      </tr>
    `;
  }
  let parsedData = buildDataPackage();

  let ingredientStepHtml = '';
  let ingredientRows = reflowText(parsedData['ingredients'], 35);
  let stepRows = reflowText(parsedData['steps'], 50)
  let rowCount = Math.max(8, ingredientRows.length, stepRows.length);
  console.log('>>> stepRows'); // TODO: REMOVE
  console.log(stepRows); // TODO: REMOVE

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
            <span style="font-weight: bold; font-size: x-large;">"${parsedData['name']}"</span> from <span style="font-style: italic;">${parsedData['author']}</span>
          </td>
        </tr>
        <tr style="height: 29.5px">
          <td style="border-bottom: 1px solid navy; padding-top: 5px; padding-bottom: 5px;" colspan=2>
            <a href="${parsedData['url']}" style="font-size: small;">${parsedData['url']}</a>
          </td>
        </tr>
        <tr style="height: 29.5px">
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
