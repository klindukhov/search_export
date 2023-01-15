window.onload = () => {
  const sendMessage = async (type) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, {
      type: type,
      regex: document.getElementById("regexInput").value,
      columns: document.getElementById("columnsInput").value,
    });
  };
  document
    .getElementById("exportAsCSV")
    .addEventListener("click", () => sendMessage("csv"));
  document
    .getElementById("exportAsTXT")
    .addEventListener("click", () => sendMessage("txt"));
};
