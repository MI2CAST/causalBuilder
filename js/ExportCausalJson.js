// --- CODE TO EXTRACT VALUES FILLED OUT IN THE TEMPLATE ---

/**
 * This function gets called when the content of the vsm-box changes,
 * so also when the user fills in a field.
 * It makes that `vsmSentInBox` always contains the latest data,
 * and it is from this that `getFlatVsmJson()` extracts what it needs.
 */
function onVsmBoxChange(event) {
    vsmSentInBox = event.detail[0];  // See the <vsm-box> project's "index-prod-standalone.html" example.
}

/**
 * This can be called to retrieve what the user has filled out in the
 * template's empty fields.
 * Returns an object with as properties: the tags that are used in the
 * template (as instructed by `panelState`), and as values:
 * either `null` if the field is not filled in,
 * or an object with the filled in string as `str`, and the filled in
 * classID as `id` (the latter only present if it is not a  literal VSM-term).
 * For Array-based tags (e.g. 'abcd__2'), it returns an array of such values.
 * E.g.:
 *   { tag1: { str: 'AKT1',  id: 'AB:0012' },
 *     tag2: { str: '25' },
 *     tag3: null,
 *     tag4: [
 *       null,
 *       { str: 'phosphorylated',  id: 'ST:0034' }
 *     ],
 *     ...
 *   }
 */
function getFlatVsmJson() {
    console.log(vsmSentInBox)
    return vsmSentInBox.terms.reduce((o, term) => {
        if (term.tag) {
            var val =
                !term.str ? null :
                    term.classID === undefined ? {str: term.str} :
                        {str: term.str, id: term.classID};

            var a = term.tag.split(TagIndexDelimiter);
            if (a.length == 1) {  // Normal tag.
                o[term.tag] = val;
            } else {                // Array-based tag.
                var tag = a[0];
                var nr = ~~a[1];
                o[tag] = o[tag] || [];
                o[tag][nr] = val;
            }
        }
        return o;
    }, {});
}

  /**
   * Taken from: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
   * Download an object as a JSON file.
   * @param {Array} exportObj
   * @param {String} exportName
   */
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/**
 * Create and export the causalJson
 */
function exportCausalJson() {
    let exportFile = new ExportCausalJson();
    exportFile.exportCausalJson(getFlatVsmJson());
    downloadObjectAsJson(exportFile.causalJson, "causalJson");
}