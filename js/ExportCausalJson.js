// --- CODE TO EXTRACT VALUES FILLED OUT IN THE TEMPLATE ---

/**
 * This function gets called when the content of the vsm-box changes,
 * so also when the user fills in a field.
 * It makes that `vsmSentInBox` always contains the latest data,
 * and it is from this that `getFlatJson()` extracts what it needs.
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
function getFlatJson() {
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
* Based on: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
*/
function downloadStr(str, type, filenameExt) {
    var dataStr = "data:text/" + type + ";charset=utf-8," + encodeURIComponent(str);
    var el = document.createElement('a');
    el.setAttribute("href", dataStr);
    el.setAttribute("download", filenameExt);
    el.style.display = 'none';
    document.body.appendChild(el); // required for firefox
    el.click();
    el.remove();
}

function downloadTextFile(text, filename) {
    downloadStr(text, "plain", filename + ".txt");
}

function downloadStringAsJson(text, filename) {
    downloadStr(text, "json", filename + ".json");
}

function downloadObjectAsJson(object, filename) {
    downloadStringAsJson(JSON.stringify(object), filename);
}


/**
 * Export function to generate a causal-json
 * Uses the converter-causal-formats npm package
 */
function exportCausalJson(){
    let exportcausaljson = new ConvertCausalFormats();
    exportcausaljson.choice = "flatjson2causaljson";
    exportcausaljson.input = getFlatJson();
    var causalJson = exportcausaljson.doConversion();
    downloadObjectAsJson(causalJson, "causal-json");
}

/**
 * Export function to generate a MITAB2.8
 * Uses the converter-causal-formats npm package
 */
function exportMitab28(){
    let exportmitab = new ConvertCausalFormats();
    exportmitab.choice = "flatjson2mitab";
    exportmitab.input = getFlatJson();
    var mitab = exportmitab.doConversion();
    downloadTextFile(mitab, "causal-mitab");
}

function exportVsmJson(){
    downloadStringAsJson(VsmJsonPretty(vsmSentInBox), "causal-vsm");
}

function exportVsmLightJson(){
    var vsm = JSON.parse(JSON.stringify(vsmSentInBox));
    vsm.terms.forEach(t => {
      delete t.dictID;
      delete t.descr;
      delete t.queryOptions;
      delete t.minWidth;
      delete t.maxWidth;
      delete t.editWidth;
      delete t.type;
      delete t.tag;
      if (t.str)  delete t.placeholder;
    });
    downloadStringAsJson(VsmJsonPretty(vsm), "causal-vsm-light");
}
