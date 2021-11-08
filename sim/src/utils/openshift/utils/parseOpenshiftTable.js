const _parseTableRow = (line) => {
    var cells = line.split('  ');
    cells = cells.filter(cell => cell !== '');
    cells = cells.map(cell => cell.trim());
    return cells;
}

const parseOpenshiftTable = (text) => {
    if (text.match(/No resources found/)) {
        return [];
    }

    const lines = text.split('\n').filter(line => line !== '');
    const [headerRow, ...dataRows] = lines;
    const headers = _parseTableRow(headerRow).map(text => text.toLowerCase());

    var list = [];
    for (var i = 0; i < dataRows.length; i++) {
        const cells = _parseTableRow(dataRows[i]);
        var item = {};
        for (var j=0; j<headers.length; j++) {
            key = headers[j];
            item[key] = cells[j];
        }
        list.push(item);
    }
    return list;
}

module.exports = parseOpenshiftTable;
