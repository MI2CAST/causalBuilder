// --- CODE TO EXTRACT VALUES FILLED OUT IN THE TEMPLATE ---

/**
 * Array of causal statements in a causalJson format
 */
let causalJson = [];

/**
 * A map with VSM terms as keys and causalJson structure as values
 */
let VSM_TO_CAUSALJSON = new Map();
VSM_TO_CAUSALJSON.set("source", ["source"]);
VSM_TO_CAUSALJSON.set("target", ["target"]);
VSM_TO_CAUSALJSON.set("regulation", ["regulation"]);

VSM_TO_CAUSALJSON.set("sourceType", ["source", "biologicalType"]);
VSM_TO_CAUSALJSON.set("sourceActivity", ["source", "biologicalActivity"]);
VSM_TO_CAUSALJSON.set("sourceTaxon", ["source", "entityTaxon"]);
VSM_TO_CAUSALJSON.set("sourceModificationMod", ["source", "biologicalModifications", "biologicalModification", "modification"]);
VSM_TO_CAUSALJSON.set("sourceModificationModPos", ["source", "biologicalModifications", "biologicalModification", "position"]);
VSM_TO_CAUSALJSON.set("sourceModificationModRes", ["source", "biologicalModifications", "biologicalModification", "residue"]);
VSM_TO_CAUSALJSON.set("sourceCompartment", ["source", "entityCompartment"]);
VSM_TO_CAUSALJSON.set("sourceExperiment", ["source", "experimentalSetup"]);

VSM_TO_CAUSALJSON.set("targetType", ["target", "biologicalType"]);
VSM_TO_CAUSALJSON.set("targetActivity", ["target", "biologicalActivity"]);
VSM_TO_CAUSALJSON.set("targetTaxon", ["target", "entityTaxon"]);
VSM_TO_CAUSALJSON.set("targetModificationMod", ["target", "biologicalModifications", "biologicalModification", "modification"]);
VSM_TO_CAUSALJSON.set("targetModificationModPos", ["target", "biologicalModifications", "biologicalModification", "position"]);
VSM_TO_CAUSALJSON.set("targetModificationModRes", ["target", "biologicalModifications", "biologicalModification", "residue"]);
VSM_TO_CAUSALJSON.set("targetCompartment", ["target", "entityCompartment"]);
VSM_TO_CAUSALJSON.set("targetExperiment", ["target", "experimentalSetup"]);

VSM_TO_CAUSALJSON.set("regulationMechanism", ["regulation", "biologicalMechanism"]);
VSM_TO_CAUSALJSON.set("regulationTaxon", ["regulation", "regulationTaxon"]);
VSM_TO_CAUSALJSON.set("regulationCompartment", ["regulation", "regulationCompartment"]);
VSM_TO_CAUSALJSON.set("regulationCellLine", ["regulation", "cellLine"]);
VSM_TO_CAUSALJSON.set("regulationCellType", ["regulation", "cellType"]);
VSM_TO_CAUSALJSON.set("regulationTissueType", ["regulation", "tissueType"]);
VSM_TO_CAUSALJSON.set("reference", ["references", "reference"]);
VSM_TO_CAUSALJSON.set("evidence", ["evidences", "evidence"]);

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
 * Fill the json object
 * @param {Object} json
 * @param {Array} terms
 * @returns {boolean} annotated term?
 */
function fillCausalJson(json, terms) {
    for (key in terms) {
        console.log(key)
        if (terms.hasOwnProperty(key)) {
            if (!terms[key] || !terms) {
                return true;
            }
            switch (key) {
                case "source":
                case "target":
                case "regulation":
                    var path = (VSM_TO_CAUSALJSON.get(key))[0];
                    setValue(path, terms[key], json);
                    break;
                case "targetModificationMod":
                case "sourceModificationMod":
                case "sourceModificationModRes":
                case "targetModificationModRes":
                case "sourceModificationModPos":
                case "targetModificationModPos":
                        for (let index of terms[key].keys()) {
                            if (index in terms[key] !== false) {
                                var path = VSM_TO_CAUSALJSON.get(key)[0] + "." + VSM_TO_CAUSALJSON.get(key)[1] + "." + VSM_TO_CAUSALJSON.get(key)[2]+index + "." + VSM_TO_CAUSALJSON.get(key)[3];
                                setValue(path, terms[key][index], json)
                            }
                        }
                    break;
                case "reference":
                case "evidence":
                    for (let index of terms[key].keys()) { //number of references or evidences annotated
                        //path = evidences.evidence(index)
                        var path = VSM_TO_CAUSALJSON.get(key)[0] + "." + VSM_TO_CAUSALJSON.get(key)[1]+index;
                        setValue(path, terms[key][index], json);
                    }
                     break;
                default:
                    var path = VSM_TO_CAUSALJSON.get(key)[0] + "." + VSM_TO_CAUSALJSON.get(key)[1];
                    setValue(path, terms[key], json);
                    break;
            }
        }
    }
}


/**
 * Simple parser to handle properties with nested levels
 * Modified from: https://medium.com/data-scraper-tips-tricks/safely-read-write-in-deeply-nested-objects-js-a1d9ddd168c6
 * @param propertyPath 
 * @param value 
 * @param obj 
 */
function setValue(propertyPath, value, obj) {
    // splits by the dots at first and then simply pass along the array (on next iterations)
    let properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.split(".")

    // Not yet at the last property so keep digging
    if (properties.length > 1) {
      // The property doesn't exists OR is not an object (and so we overwritte it) so we create it
      if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object"){
           obj[properties[0]] = {}
      }
        // We iterate.
      return setValue(properties.slice(1), value, obj[properties[0]])
        // This is the last property - the one where to set the value
    } else {
            obj[properties[0]] = {};
            // We set the value to the last property
            obj[properties[0]]["identifier"] = value.id;
            obj[properties[0]]["name"] = value.str;

      return true // this is the end
    }
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
 * Add a causal statement into the json object and export the causalJson format
 */
function exportCausalJson() {
    json = {};
    causalJson = []; // Empty the cache - if page is not reloaded
    emptyField = fillCausalJson(json, getFlatVsmJson());
    if (emptyField) { // All VSM-terms from the template need to be annotated
        alert("Please fill the empty terms with annotations.");
    } else {
        causalJson.push(json);
        downloadObjectAsJson(causalJson, "causalJson");
    }
}