// Function to create or update data in storage
export function setItem(key, value) {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
}

// Function to read data from storage
export function getItem(key) {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key] !== undefined ? result[key] : null);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    return Promise.resolve(localStorage.getItem(key));
  }
}

// Function to remove data from storage
export function removeItem(key) {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.remove([key], () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
}

