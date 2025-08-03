document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('toggleHide');

  chrome.storage.local.get({ hideOpponent: true }, ({ hideOpponent }) => {
    checkbox.checked = !!hideOpponent;
  });

  checkbox.addEventListener('change', () => {
    chrome.storage.local.set({ hideOpponent: checkbox.checked });
  });
});