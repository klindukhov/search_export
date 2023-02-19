chrome.runtime.onMessage.addListener(function (request) {
  const html = document.getElementsByTagName("body")[0].innerHTML;

  if (request.highlight !== undefined) {
    highlightWithTreeWalker(request);
  } else if (type) {
    exportValues(request.type, request.regex, html, request.columns);
  }
});

let highlightDivs = [];

const getMatches = (regexString, target) => {
  let match;
  let matches = [];
  const regex = new RegExp(regexString, "g");

  while ((match = regex.exec(target)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    match.forEach((match) => {
      matches.push(match);
    });
  }
  return matches;
};

const download = (type, matches) => {
  let blob = new Blob([matches], {
      type: "text/" + type,
    }),
    a = document.createElement("a");

  a.download = "export." + type;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/" + type, a.download, a.href].join(":");
  a.click();
};

const constructCSV = (matches, columns) => {
  if (!columns) columns = 10;
  csv = "";
  matches.forEach((match, index) => {
    (index + 1) % columns ? (csv += match + ";") : (csv += match + "\n");
  });
  return csv;
};

const exportValues = (type, regexString, target, columns) => {
  download(type, constructCSV(getMatches(regexString, target), columns));
};

const highlightWithTreeWalker = (request) => {
  if (highlightDivs.length > 0) {
    highlightDivs.forEach((div) => {
      document.body.removeChild(div);
    });
  }
  highlightDivs = [];

  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let nodeList = [];
  let currentNode = treeWalker.currentNode;

  while (currentNode) {
    nodeList.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  const isHidden = (elem) => {
    const styles = window.getComputedStyle(elem);
    const rect = elem.getBoundingClientRect(elem);
    return (
      styles.display === "none" ||
      styles.visibility === "hidden" ||
      rect.width === 0 ||
      rect.height === 0
    );
  };

  nodeList = nodeList
    .filter((e) => e.nodeType === 3)
    .filter((e) => !isHidden(e.parentElement));

  nodeList.forEach((node) => {
    let match;
    let matches = [];
    const regex = new RegExp(request.highlight, "g");

    while ((match = regex.exec(node.nodeValue)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      matches.push(match);
    }

    if (matches.length > 0) {
      console.log(node, node.parentElement, matches);
      matches.forEach((match) => {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rects = range.getClientRects();
        if (rects.length > 0) {
          const highlightOverlay = document.createElement("div");
          const style = `
            background-color: yellow; 
            opacity: 0.4; 
            position: absolute; 
            height: ${rects["0"].height}px; 
            width: ${rects["0"].width}px; 
            left: ${rects["0"].left}px; 
            top: ${rects["0"].top}px;`;
          highlightOverlay.style = style;
          highlightDivs.push(highlightOverlay);
        }
      });
    }
  });
  highlightDivs.forEach((div) => document.body.appendChild(div));
};
