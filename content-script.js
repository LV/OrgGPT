console.log('content-script.js loaded');

function waitForElement(selector, callback) {
  if (document.querySelector(selector)) {
    console.log('Element found:', selector);
    callback();
  } else {
    console.log('Waiting for element:', selector);
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
      
      // Create a MutationObserver to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            if (addedNode.id === 'folder-container') {
              observer.disconnect();
              // Call initAddFolder when folder-container is added to the DOM
              initAddFolder();
            }
          }
        });
      });

      // Start observing the chatSelectionElement for DOM changes
      observer.observe(chatSelectionElement, { childList: true });
      
      chatSelectionElement.appendChild(foldersElement);
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
  console.log('Initializing Add Folder button');
  const addFolderBtn = document.querySelector('#add-folder-btn');
  if (addFolderBtn) {
    console.log('Add Folder button found');
    addFolderBtn.addEventListener('click', handleAddFolder);
    console.log('Add Folder button event listener added');
  } else {
    console.log('Add Folder button not found');
  }
}

// Handle add folder button click
function handleAddFolder() {
  console.log('Add Folder button clicked');
  // Create a new folder
  const folder = createFolder();
  if (folder) {
    console.log('New folder created:', folder);
    // Save the folder
    saveFolder(folder);
    // Update the UI
    addFolderToUI(folder);
  } else {
    console.log('Folder creation failed');
  }
}

// Function to handle messages from the background script
function handleMessage(request, sender, sendResponse) {
  // Process the message and perform any necessary actions, such as updating the folder system or linking conversations
}

// Add a listener for messages from the background script
browser.runtime.onMessage.addListener(handleMessage);


// Create a new folder
function createFolder() {
  const id = Date.now(); // Use the current timestamp as a unique id
  const name = prompt('Enter folder name'); // Prompt the user to enter a folder name
  const chats = []; // Start with an empty array of chats
  return { id, name, chats };
}

// Save the folder
function saveFolder(folder) {
  // Get the current list of folders from storage
  browser.storage.local.get('folders').then((result) => {
    const folders = result.folders || [];
    // Add the new folder to the list
    folders.push(folder);
    // Save the updated list of folders
    browser.storage.local.set({ folders });
  });
}

// Update the UI
function addFolderToUI(folder) {
  const folderListElement = document.querySelector('#folder-list');
  const folderElement = document.createElement('div');
  folderElement.textContent = folder.name;
  folderListElement.appendChild(folderElement);
}

