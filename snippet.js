const regex = /T\d{8}/gm;

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

console.API;
if (typeof console._commandLineAPI !== "undefined") {
  console.API = console._commandLineAPI; //chrome
} else if (typeof console._inspectorCommandLineAPI !== "undefined") {
  console.API = console._inspectorCommandLineAPI; //Safari
} else if (typeof console.clear !== "undefined") {
  console.API = console;
}

console.save = function (data, filename) {
  if (!data) {
    console.error("Console.save: No data");
    return;
  }

  if (!filename) filename = "story.json";

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }

  var blob = new Blob([data], {
      type: "text/json",
    }),
    e = document.createEvent("MouseEvents"),
    a = document.createElement("a");

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initMouseEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
};

console.save(matches.join("\n"), "filenamemmm");
