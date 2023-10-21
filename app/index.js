const { ipcRenderer } = require('electron');

// Listen for messages from the main process
ipcRenderer.on('newExtension', (event, arg) => {
  console.log(arg);
  createNewAppAddRequest(arg);
});
ipcRenderer.on('addedExtension', (event, arg) => {
  console.log(arg);
  createExtensionDisplay(arg);
});
function createNewAppAddRequest(arg = { icon: new String, name: new String, developer: new String, version: new String }) {
  const div = document.createElement("div")
  div.classList.add("request")
  html = `
  <div class="l">
  <img src="${arg.icon}" alt="">
<div class="stack">
  <div class="name">${arg.name} <div class="version">${arg.version}</div></div>
  <div class="author">${arg.developer}</div>
</div>
</div>
<span class="material-symbols-rounded button">
  add
  </span>`
  div.innerHTML = html
  div.querySelectorAll(".button")[0].addEventListener("click", () => {
    div.remove();
    addExtension(arg["id"])
  })
  document.querySelectorAll(".requests")[0].append(div)
}

function createExtensionDisplay(arg = { icon: new String, name: new String, developer: new String, version: new String, enabled: new Boolean }) {
  document.querySelector("#NoExtensions").style.display = "none"
  const div = document.createElement("div")
  div.classList.add("extension")
  html = `<div class="l"> <img src="${arg.icon}" alt="">
      <div class="name">${arg.name}</div>
  </div>
  <div class="r">
      <div class="container">
          <input type="checkbox" />
      </div>
  </div>`
  div.innerHTML = html
  div.querySelectorAll("input")[0].checked = arg.enabled
  div.querySelectorAll("input")[0].addEventListener("click", () => {
    if(div.querySelectorAll("input")[0].checked){
      enableExtension(arg["id"])
    }else{
      disableExtension(arg["id"])
    }
  })
  document.querySelectorAll(".extensions")[0].append(div)
}


function addExtension(id = new String) {
  ipcRenderer.send('addExtension', id);

}
function enableExtension(id = new String) {
  ipcRenderer.send('enableExtension', id);

}
function disableExtension(id = new String) {
  ipcRenderer.send('disableExtension', id);

}

window.addEventListener('DOMContentLoaded', () => {
  //code here bro

  function showBack() {
    document.querySelectorAll("#back")[0].style.display = "flex"
  }

  function hideBack() {
    document.querySelectorAll("#back")[0].style.display = "none"
  }
  function showinbox() {
    document.querySelectorAll("#inbox")[0].style.display = "flex"
  }

  function hideinbox() {
    document.querySelectorAll("#inbox")[0].style.display = "none"
  }
  function showExtensions() {
    document.querySelectorAll(".extensions")[0].style.display = "block"

  }
  function hideExtensions() {
    document.querySelectorAll(".extensions")[0].style.display = "none"

  }
  function showExtensionRequests() {
    document.querySelectorAll(".requests")[0].style.display = "flex"

  }
  function hideExtensionRequests() {
    document.querySelectorAll(".requests")[0].style.display = "none"

  }
  document.querySelectorAll("#inbox")[0].addEventListener("click", () => {
    hideExtensions()
    showExtensionRequests()
    hideinbox()
    showBack()
  })
  document.querySelectorAll("#back")[0].addEventListener("click", () => {
    showExtensions()
    hideExtensionRequests()
    showinbox()
    hideBack()
  })
})
