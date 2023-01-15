window.onload = () => {
  const sendMessage = async (message) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, message);
  };
  document
    .getElementById("exportAsCSV")
    .addEventListener("click", () => sendMessage({ type: "csv" }));
  document
    .getElementById("exportAsTXT")
    .addEventListener("click", () => sendMessage({ type: "txt" }));
};
