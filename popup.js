window.onload = () => {
  const sendMessage = async (message) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, message);
  };
  const createDownloadMessage = (type) => {
    return {
      type: type,
      regex: document.getElementById("regexInput").value,
      columns: document.getElementById("columnsInput").value,
    };
  };
  document
    .getElementById("exportAsCSV")
    .addEventListener("click", () => sendMessage(createDownloadMessage("csv")));
  document
    .getElementById("exportAsTXT")
    .addEventListener("click", () => sendMessage(createDownloadMessage("txt")));
  document.getElementById("regexInput").addEventListener("input", (e) => {
    console.log("change");
    sendMessage({ highlight: document.getElementById("regexInput").value });
  });
};
