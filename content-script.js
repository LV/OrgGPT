console.log('content-script.js loaded');

function waitForElement(selector, callback) {
  if (document.querySelector(selector)) {
    console.log('Element found:', selector); // Add this line
    callback();
  } else {
    console.log('Waiting for element:', selector); // Add this line
    setTimeout(() => waitForElement(selector, callback), 500);
  }
}

// Load the content of folders.html and inject it into the ChatGPT web interface
waitForElement('.flex.flex-col.gap-2.pb-2.text-gray-100.text-sm', () => {
  fetch(browser.runtime.getURL('folders.html'))
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const chatSelectionElement = document.querySelector('.flex.flex-col.gap-2.pb-2.text-gray-100.text-sm');
      chatSelectionElement.style.border = '3px solid red';
      const foldersElement = parser.parseFromString(html, 'text/html').querySelector('#folder-container');
      chatSelectionElement.appendChild(foldersElement);

      // Add event listeners and other initialization code here
      initSearch();
      initAddFolder();
    });
});

// Initialize search functionality
function initSearch() {
  const searchInput = document.querySelector('#search-input');
  searchInput.addEventListener('input', handleSearch);
}

// Handle search input
function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();
  // Perform search and update the folder system based on the query
}

// Initialize add folder functionality
function initAddFolder() {
  const addFolderBtn = document.querySelector('#add-folder-btn');
  addFolderBtn.addEventListener('click', handleAddFolder);
}

// Handle add folder button click
function handleAddFolder() {
  // Create and save a new folder
}

// Function to handle messages from the background script
function handleMessage(request, sender, sendResponse) {
  // Process the message and perform any necessary actions, such as updating the folder system or linking conversations
}

// Add a listener for messages from the background script
browser.runtime.onMessage.addListener(handleMessage);

// ... other content script code, such as functions for linking conversations, etc.

