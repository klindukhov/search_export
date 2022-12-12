const getMatches = (regex) => {
  const html = document.getElementsByTagName("body")[0].innerHTML;
  let m;

  let matches = [];

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

download = function (regex, type, columns) {
  const matches = getMatches(regex);

  if (matches.lenght === 0) {
    console.error("No data");
    return;
  }

  const matchesCSV = constructCSV(matches, columns);

  let blob = new Blob([matchesCSV], {
      type: "text/" + type,
    }),
    a = document.createElement("a");

  a.download = "export." + type;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/" + type, a.download, a.href].join(":");
  a.click();
};

const regex = /[a-z0-9]{7}/gm;

download(regex, "txt", 9);
