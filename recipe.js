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
  let parsedData = makeDataPacka
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

function exportDataPackage(data) {
  let params = new URL(window.location.href);
  let encoded = atob(data);
  params.searchParams.append('d', encoded);
}

let params = new URLSearchParams(document.location.search);
let data = parseDataPackage(params.get("d"));


