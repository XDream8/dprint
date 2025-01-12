// Replaces plugin links with the latest version.
const typescriptUrl = "https://plugins.dprint.dev/typescript-x.x.x.wasm";
const jsonUrl = "https://plugins.dprint.dev/json-x.x.x.wasm";
const markdownUrl = "https://plugins.dprint.dev/markdown-x.x.x.wasm";
const tomlUrl = "https://plugins.dprint.dev/toml-x.x.x.wasm";
const dockerfileUrl = "https://plugins.dprint.dev/dockerfile-x.x.x.wasm";
const pluginInfoUrl = "https://plugins.dprint.dev/info.json";
const schemaVersion = 4;

export function replacePluginUrls() {
  const elements = getPluginUrlElements();
  if (elements.length > 0) {
    getPluginInfo().then((urls) => {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        switch (element.textContent) {
          case getWithQuotes(typescriptUrl):
            element.textContent = getWithQuotes(urls["typescript"]);
            break;
          case getWithQuotes(jsonUrl):
            element.textContent = getWithQuotes(urls["json"]);
            break;
          case getWithQuotes(markdownUrl):
            element.textContent = getWithQuotes(urls["markdown"]);
            break;
          case getWithQuotes(tomlUrl):
            element.textContent = getWithQuotes(urls["toml"]);
            break;
          case getWithQuotes(dockerfileUrl):
            element.textContent = getWithQuotes(urls["dockerfile"]);
            break;
        }
      }
    });
  }
}

function getPluginUrlElements() {
  const stringElements = document.getElementsByClassName("hljs-string");
  const result = [];
  for (let i = 0; i < stringElements.length; i++) {
    const stringElement = stringElements.item(i);
    switch (stringElement.textContent) {
      case getWithQuotes(typescriptUrl):
      case getWithQuotes(jsonUrl):
      case getWithQuotes(markdownUrl):
      case getWithQuotes(tomlUrl):
      case getWithQuotes(dockerfileUrl):
        result.push(stringElement);
        break;
    }
  }
  return result;
}

function getWithQuotes(text) {
  return "\"" + text + "\"";
}

function getPluginInfo() {
  return fetch(pluginInfoUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.schemaVersion !== schemaVersion) {
        throw new Error("Expected schema version " + schemaVersion + ", but found " + data.schemaVersion);
      }

      return {
        typescript: getUrlForPlugin(data, "dprint-plugin-typescript"),
        json: getUrlForPlugin(data, "dprint-plugin-json"),
        markdown: getUrlForPlugin(data, "dprint-plugin-markdown"),
        toml: getUrlForPlugin(data, "dprint-plugin-toml"),
        dockerfile: getUrlForPlugin(data, "dprint-plugin-dockerfile"),
      };
    });

  function getUrlForPlugin(data, pluginName) {
    const pluginInfo = data.latest.find((pluginInfo) => {
      return pluginInfo.name === pluginName;
    });
    if (pluginInfo == null) {
      throw new Error("Could not find plugin with name " + pluginName);
    }

    return pluginInfo.url;
  }
}
