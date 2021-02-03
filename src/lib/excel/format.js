// see https://github.com/exceljs/exceljs/issues/450

export function eachColumnInRange(ws, col1, col2, cb) {
  for (let c = col1; c <= col2; c++) {
    let col = ws.getColumn(c);
    cb(col);
  }
}

// not sure on units; width seems to follow offical excel documentation,
// which is the number of default font's characters which fit into a cell.
// default font is Arial 10, which is used here
// observation: (column width) ~= (column pixel width)/7
// (column width) = ((exceljs width) - 0.71) when (exceljs width) is an integer
// bolding increases width by ~5-9%

export function autoFitColumnWidth(ws) {
  // no good way to get text widths
  eachColumnInRange(ws, 1, ws.columnCount, (column) => {
    let maxWidth = 10;
    column.eachCell((cell) => {
      if (!cell.isMerged && cell.value) {
        // doesn't handle merged cells

        let text = '';
        if (typeof cell.value != 'object') {
          // string, number, ...
          text = cell.value.toString();
        } else if (cell.value.richText) {
          // richText
          text = cell.value.richText.reduce(
            (text, obj) => text + obj.text.toString(),
            ''
          );
        }

        // handle new lines -> don't forget to set wrapText: true
        let values = text.split(/[\n\r]+/);

        for (let value of values) {
          let width = value.length;

          if (cell.font && cell.font.bold) {
            width *= 1.08; // bolding increases width
          }

          maxWidth = Math.max(maxWidth, width);
        }
      }
    });

    maxWidth += 0.71; // compensate for observed reduction
    maxWidth += 1; // buffer space

    column.width = maxWidth;
  });
}

// maps between arbitrary columns more generally represent a cyclic graph.
// To propagate each max value properly, must explore entirity of each subgraph.
// sheetMap: [[ sheetId1, sheetId2, [[columnId1, columnId2],...] ],...]
function linkColumnWidths(workbook, sheetMap) {
  let graph = {};

  let sheetCols = sheetMap.reduce(
    (sheetCols, colMap) =>
      sheetCols.concat(
        colMap[2].map((edge) => [colMap[0], edge[0]]),
        colMap[2].map((edge) => [colMap[1], edge[1]])
      ),
    []
  ); // [[sheetIdN, columnIdN], ...]

  for (let [sheetId, columnId] of sheetCols) {
    let sheet = workbook.getWorksheet(sheetId);
    let column = sheet.getColumn(columnId);

    graph[`${sheetId}-${columnId}`] = {
      sheetId: sheetId,
      columnId: columnId,
      width: column.width,
      edges: {},
    };
  }

  for (let [sheetId1, sheetId2, colMap] of sheetMap) {
    for (let [columnId1, columnId2] of colMap) {
      let key1 = `${sheetId1}-${columnId1}`;
      let key2 = `${sheetId2}-${columnId2}`;

      graph[key1].edges[key2] = graph[key2];
      graph[key2].edges[key1] = graph[key1];
    }
  }

  let dfs = function (node, unvisited, visited) {
    unvisited.delete(node);
    visited.add(node);

    return Math.max(
      node.width,
      ...Object.values(node.edges)
        .filter((edge) => unvisited.has(edge))
        .map((edge) => dfs(edge, unvisited, visited))
    );
  };

  let unvisited = new Set(Object.values(graph));
  while (unvisited.size > 0) {
    let visited = new Set();

    let initialNode = unvisited.values().next().value;
    let maxWidth = dfs(initialNode, unvisited, visited);

    for (let node of visited) {
      node.width = maxWidth;
    }
  }

  for (let node of Object.values(graph)) {
    let sheet = workbook.getWorksheet(node.sheetId);
    let column = sheet.getColumn(node.columnId);

    column.width = node.width;
  }
}
