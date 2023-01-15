chrome.runtime.onMessage.addListener(function (request) {
  const getMatches = (regexString) => {
    const html = document.getElementsByTagName("body")[0].innerHTML;
    let m;

    let matches = [];

    const regex = new RegExp(regexString, "g");

    while ((m = regex.exec(html)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.forEach((match) => {
        matches.push(match);
      });
    }
    return matches;
  };

  const constructCSV = (matches, columns) => {
    if (!columns) columns = 10;
    csv = "";
    matches.forEach((match, index) => {
      (index + 1) % columns ? (csv += match + ";") : (csv += match + "\n");
    });
    return csv;
  };

  download = function (type, matches) {
    let blob = new Blob([matches], {
        type: "text/" + type,
      }),
      a = document.createElement("a");

    a.download = "export." + type;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/" + type, a.download, a.href].join(":");
    a.click();
  };

  const exportValues = (type, regex, columns) => {
    alert(request.type);

    const matches = getMatches(regex);
    if (!columns) columns = 10;
    let formattedMatches = constructCSV(matches, columns);
    download(type, formattedMatches);
  };

  const type = request.type ?? "csv";
  const regex = request.regex ?? /npm/;
  const columns = request.columns ?? 10;
  exportValues(type, regex, columns);
});
