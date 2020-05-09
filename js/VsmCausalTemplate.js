
// initialize the vsm-dictionaries
var VsmDictUniprot     	= new VsmDictionaryUniprot();
var VsmDictComplexPortal  = new VsmDictionaryComplexPortal();
var VsmDictEnsemblGenomes = new VsmDictionaryEnsemblGenomes();
var VsmDictEnsembl    	= new VsmDictionaryEnsembl();
var VsmDictRNAcentral  	= new VsmDictionaryRNAcentral();

var keyBioportal = '5904481f-f6cb-4c71-94d8-3b775cf0f19e';
var keyPubMed = '57d456615939f9d1897d794ccb6fd1099408';

var VsmDictPubMed = new VsmDictionaryPubMed({apiKey: keyPubMed});
var VsmDictBioPortal      = new VsmDictionaryBioPortal({ apiKey: keyBioportal });

// initialize a cached version of the combiner
var VsmDictionaryCombinerCached = VsmDictionaryCacher(VsmDictionaryCombiner, { predictEmpties: false });
var dictionary = new VsmDictionaryCombinerCached({
    // Give all required dictionaries as initialized Objects in this array
    dictionaries: [
        VsmDictUniprot,
        VsmDictEnsembl,
        VsmDictRNAcentral,
        VsmDictComplexPortal,
        VsmDictBioPortal,
        VsmDictEnsemblGenomes,
        VsmDictPubMed
    ],
    //errorIfAllErrors: true
});


var vsmbox;      // The <vsm-box> HTML-element.
var panelState;  // An object that represents the current values in web-page's template configuration panel.

var vsmSentInBox = { terms: [], conns: [] };  // The vsmbox's latest emitted data, i.e. its current content.

window.onload = function() {
    vsmbox = document.getElementsByTagName('vsm-box')[0];
    vsmbox.sizes = { minWidth: 500 };
    vsmbox.queryOptions = { perPage: 7 };

    makeAllRequestsHttps();  // To make VsmDictionaryBioportal's http-requests work on GitHub Pages.

    vsmbox.vsmDictionary = dictionary;
    vsmbox.addEventListener('change',      onVsmBoxChange);  // Captures user-generated changes.
    vsmbox.addEventListener('change-init', onVsmBoxChange);  // Captures the change of placing a new template.
    initVsmBox();
}


function makeAllRequestsHttps() {
    var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName('head')[0].appendChild(meta);
}


/**
 * First initialisation of the vsmbox
 */
function initVsmBox(){
    computeInitialPanelState();
    updateVsmBox();
}


/**
 * Initial panelState
 */
function computeInitialPanelState() {
    panelState = {
        sourceType: false,
        sourceActivity: false,
        sourceModification: [
        ],
        sourceExperiment: 0,
        sourceTaxon: false,
        sourceCompartment: false,
        targetType: false,
        targetActivity: false,
        targetModification: [
        ],
        targetExperiment: 0,
        targetTaxon,
        targetCompartment,
        effectMechanism: false,
        effectTaxon: false,
        effectCompartment: false,
        effectCellType: false,
        effectTissue: false,
        reference: 1,
        evidence: 1
    };
}


/**
 * Updates the vsm-box after a change occurs in the interface, to add or remove some vsm-terms. It:
 * - builds a new vsm-template based on the new settings (by calling 'doInsertionTasks'),
 * - copies any filled-in annotations from the existing template to the new one, but keeps
 *   DB-selection options (in queryOptions, set by updateEntityDatabase()) from the new vsm-terms,
 * - puts this new template in the vsm-box.
 */
function updateVsmBox(){
    vsmSent = clone(vsmRoot);
    insertionTasks.forEach(doInsertionTask);

    vsmSentInBox.terms.forEach(term => {
      if (term.tag) {
        var i = vsmSent.terms.findIndex(termNew => termNew.tag == term.tag);
        if (i != -1) {
          var q = vsmSent.terms[i].queryOptions;
          var t = vsmSent.terms[i] = clone(term);
          if (q)  t.queryOptions = clone(q);
        }
      }
    });

    vsmbox.initialValue = vsmSentInBox = vsmSent;
}


/**
 * Mapping between the DB name associated with the type of the entity (source|target) and the databases' links
 */
const EntityDbs = {
    "sourceUniprot" : "https://www.uniprot.org",
    "targetUniprot" : "https://www.uniprot.org",
    "sourceEnsembl" : "https://www.ensembl.org",
    "targetEnsembl" : "https://www.ensembl.org",
    "sourceRnacentral" : "https://www.rnacentral.org",
    "targetRnacentral" : "https://www.rnacentral.org",
    "sourceEnsemblGen" : "http://www.ensemblgenomes.org",
    "targetEnsemblGen" : "http://www.ensemblgenomes.org",
    "sourceChebi" : "http://data.bioontology.org/ontologies/CHEBI",
    "targetChebi" : "http://data.bioontology.org/ontologies/CHEBI",
    "sourceComplexportal" : "https://www.ebi.ac.uk/complexportal",
    "targetComplexportal" : "https://www.ebi.ac.uk/complexportal",
    "sourceGO": "https://data.bioontology.org/ontologies/GO",
    "targetGO": "https://data.bioontology.org/ontologies/GO",
}


/**
 * Limits the dictionaries during autocomplete of source and target entities,
 * based on the selected databases by the user. This facilitates the search and retrieves less noisy data to the user.
 * By default: all dictionaries are used
 */
function updateEntityDatabase(list, type){
    entityToUpdate = {};
    if(type === "source"){
        entityToUpdate = SourceEntity;
    }
    else{
        entityToUpdate = TargetEntity;
    }

    entityToUpdate.queryOptions.filter.dictID = [];
    if(list === null){
        entityToUpdate.queryOptions.filter.dictID = [];
    }
    else{
        list.reduce((o,term) =>{
            entityToUpdate.queryOptions.filter.dictID.push(EntityDbs[term]);
        }, {});
    }

    // update VSM root with new dictionaries for autocomplete
    vsmRoot = {
        terms: [
            X(SourceEntity,     'source',     'source'),
            X(Effect, 'effect', 'effect'),
            X(TargetEntity,     'target',     'target'),
        ],
        conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
    };

    updateVsmBox();
}


/**
 * A collection of all the VSM-term Objects that we will use.
 */

const SourceEntity = {
    queryOptions: { filter: { dictID: [] }}
};

const TargetEntity = {
    queryOptions: { filter: { dictID: [] }}
};

const Effect = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI', 'http://data.bioontology.org/ontologies/OBOREL' ] }}
};

const IsAType = {
    str: 'is a', classID: null, instID: null
};
const Type = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI' ] }}
};

const HasActivity = {
    str: 'has activity', classID: null, instID: null
};
const Activity = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/GO' ] }}
};

const HasModif = {
    str: 'has modif', classID: null, instID: null
};
const Modification = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/PSIMOD' ] }}
};

const OfResidue = {
    str: 'of', classID: null, instID: null
};
const Residue = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/CHEBI' ] }},
    editWidth: 50
};

const AtPosition = {
    str: 'at', classID: null, instID: null
};
const Position = {
    type: 'EL', editWidth: 26
};

const HasSetup = {
    str: 'has setup', classID: null, instID: null
};
const Experiment = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/ECO', 'http://data.bioontology.org/ontologies/MI' ] }}
};

const PartOfTaxon = {
    str: 'in', classID: null, instID: null
};
const Taxon = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/NCBITAXON' ] }}
};

const PartOfCompartment = {
    str: 'in', classID: null, instID: null
};
const Compartment = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/GO' ] }}
};

const HasMechanism = {
    str: 'has mechanism', classID: null, instID: null
};
const Mechanism = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI' ] }}
};

const PartOfTissue = {
    str: 'in', classID: null, instID: null
};
const Tissue = {
    queryOptions: { filter: { dictID: [
                'http://data.bioontology.org/ontologies/UBERON',
                'http://data.bioontology.org/ontologies/PO',
                'http://data.bioontology.org/ontologies/FAO' ] }}
};

const PartOfCellType = {
    str: 'in', classID: null, instID: null
};
const CellType = {
    queryOptions: { filter: { dictID: [
                'http://data.bioontology.org/ontologies/CL' ,
                'http://data.bioontology.org/ontologies/BTO'
 ] }}
};


const HasReference = {
    str: 'has reference', classID: null, instID: null
};
const Reference = {
    queryOptions: {filter: { dictID: ['https://www.ncbi.nlm.nih.gov/pubmed']}}
};

const AssessedByEvidence = {
    str: 'is assessed by', classID: null, instID: null
};
const Evidence = {
    queryOptions: {filter: { dictID: [ 'http://data.bioontology.org/ontologies/ECO' ] }}
};


/**
 * Creates a augmented copy of any of the above vsm-term objects:
 * adds a `tag` and a `placeholder` property.
 */
function X(obj, tag, placeholder) {
    var obj = clone(obj);
    if (tag)  obj.tag = tag;
    if (placeholder)  obj.placeholder = placeholder;
    return obj;
}


/**
 * The minimal template from which we will start each time, and add extra fragments to.
 */
var vsmRoot = {
    terms: [
        X(SourceEntity,     'source',     'source'),
        X(Effect, 'effect', 'effect'),
        X(TargetEntity,     'target',     'target'),
    ],
    conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
};


/**
 * The order of these tag-names determine where vsm-fragments will be inserted.
 */
tagOrder = [
    'source',
    'sourceType',
    'sourceActivity',
    'sourceModificationMod',
    'sourceModificationModRes',
    'sourceModificationModPos',
    'sourceExperiment',
    'sourceTaxon',
    'sourceCompartment',
    'effect',
    'target',
    'targetType',
    'targetActivity',
    'targetModificationMod',
    'targetModificationModRes',
    'targetModificationModPos',
    'targetExperiment',
    'targetTaxon',
    'targetCompartment',
    'effectMechanism',
    'effectTaxon',
    'effectTissue',
    'effectCellType',
    'effectCompartment',
    'reference',
    'evidence',
];

const TagIndexDelimiter = '__';  // Will result in tags like reference__1, etc.


/**
 * `insertionTasks` is an array of insertions tasks that can be executed. Each task
 * defines the condition for, and where at, to insert a certain vsm-fragment.
 *
 * The insertions will be made consecutively, starting from the minimal `vsmRoot` template.
 *
 * Each insertion will either happen, or not happen, or happen multiple times,
 * depending on the corresponding property in the current `panelState`.
 *
 * Format of each task:
 *   { panelCondition: '<which property (true|false|Array) to look for in `panelState`>',
 *     findTag: '<which tag to insert at, in the vsm-sentence>',
 *     insertFrag: { <what structure will be inserted, connected the vsm-term with that tag > }
 *   }
 *
 * One of the terms in `insertFrag` must refer to a term that already is present in `vsmSent`,
 * and is represented by just `0` instead of a vsm-term object.
 * [[For now this is just assumed to be the first term in `insertFrag`.]]
 *
 * Instead of `insertFrag`, the task can an `insertVariants` object,
 * with as keys: the possible String values in the `panelState...` array,
 * and as values: corresponding `insertFrag`-like objects.
 */
var insertionTasks = [

    // --- SOURCE ENTITY extensions ---

    { panelCondition: 'sourceType',
        findTag: 'source',
        insertFrag:
            { terms: [ 0, IsAType, X(Type, 'sourceType', 'type') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'sourceActivity',
        findTag: 'source',
        insertFrag:
            { terms: [ 0, HasActivity, X(Activity, 'sourceActivity', 'activity') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'sourceModification',
        findTag: 'source',
        insertVariants: {
            'mod':
                { terms: [ 0, HasModif, X(Modification, 'sourceModificationMod', 'modification') ],
                    conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
                },
            'modres':
                { terms: [ 0,
                        HasModif, X(Modification, 'sourceModificationMod', 'modification'),
                        OfResidue, X(Residue, 'sourceModificationModRes', 'residue')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] }
                    ]
                },
            'modpos':
                { terms: [ 0,
                        HasModif, X(Modification, 'sourceModificationMod', 'modification'),
                        AtPosition, X(Position, 'sourceModificationModPos', 'pos')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] }
                    ]
                },
            'modrespos':
                { terms: [ 0,
                        HasModif, X(Modification, 'sourceModificationMod', 'modification'),
                        OfResidue, X(Residue, 'sourceModificationModRes', 'residue'),
                        AtPosition, X(Position, 'sourceModificationModPos', 'pos')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] },
                        { type: 'T', pos: [ 2, 5, 6 ] }
                    ]
                }
        }
    },

    { panelCondition: 'sourceExperiment',
        findTag: 'source',
        insertFrag:
            { terms: [ 0, HasSetup, X(Experiment, 'sourceExperiment', 'experiment') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'sourceTaxon',
        findTag: 'source',
        insertFrag:
            { terms: [ 0, PartOfTaxon, X(Taxon, 'sourceTaxon', 'taxon') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'sourceCompartment',
        findTag: 'source',
        insertFrag:
            { terms: [ 0, PartOfCompartment, X(Compartment, 'sourceCompartment', 'compartment') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },



    // --- TARGET ENTITY extensions ---

    { panelCondition: 'targetType',
        findTag: 'target',
        insertFrag:
            { terms: [ 0, IsAType, X(Type, 'targetType', 'type') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'targetActivity',
        findTag: 'target',
        insertFrag:
            { terms: [ 0, HasActivity, X(Activity, 'targetActivity', 'activity') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'targetModification',
        findTag: 'target',
        insertVariants: {
            'mod':
                { terms: [ 0, HasModif, X(Modification, 'targetModificationMod', 'modification') ],
                    conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
                },
            'modres':
                { terms: [ 0,
                        HasModif, X(Modification, 'targetModificationMod', 'modification'),
                        OfResidue, X(Residue, 'targetModificationModRes', 'residue')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] }
                    ]
                },
            'modpos':
                { terms: [ 0,
                        HasModif, X(Modification, 'targetModificationMod', 'modification'),
                        AtPosition, X(Position, 'targetModificationModPos', 'pos')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] }
                    ]
                },
            'modrespos':
                { terms: [ 0,
                        HasModif, X(Modification, 'targetModificationMod', 'modification'),
                        OfResidue, X(Residue, 'targetModificationModRes', 'residue'),
                        AtPosition, X(Position, 'targetModificationModPos', 'pos')
                    ],
                    conns: [
                        { type: 'T', pos: [ 0, 1, 2 ] },
                        { type: 'T', pos: [ 2, 3, 4 ] },
                        { type: 'T', pos: [ 2, 5, 6 ] }
                    ]
                }
        }
    },

    { panelCondition: 'targetExperiment',
        findTag: 'target',
        insertFrag:
            { terms: [ 0, HasSetup, X(Experiment, 'targetExperiment', 'experiment') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'targetTaxon',
        findTag: 'target',
        insertFrag:
            { terms: [ 0, PartOfTaxon, X(Taxon, 'targetTaxon', 'taxon') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'targetCompartment',
        findTag: 'target',
        insertFrag:
            { terms: [ 0, PartOfCompartment, X(Compartment, 'targetCompartment', 'compartment') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },



    // --- REGULATION extensions ---

    { panelCondition: 'effectMechanism',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, HasMechanism, X(Mechanism, 'effectMechanism', 'mechanism') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'effectTaxon',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, PartOfTaxon, X(Taxon, 'effectTaxon', 'taxon') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'effectTissue',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, PartOfTissue, X(Tissue, 'effectTissue', 'tissue') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'effectCellType',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, PartOfCellType, X(CellType, 'effectCellType', 'cell type') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'effectCompartment',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, PartOfCompartment, X(Compartment, 'effectCompartment', 'compartment') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },



    // --- REGULATION extensions part 2 ---

    { panelCondition: 'reference',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, HasReference, X(Reference, 'reference', 'reference') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },

    { panelCondition: 'evidence',
        findTag: 'effect',
        insertFrag:
            { terms: [ 0, AssessedByEvidence, X(Evidence, 'evidence', 'evidence') ],
                conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
            }
    },
];


function doInsertionTask(task) {
    var state = panelState[task.panelCondition];

    if (state === true)  insertFrag(task.findTag,  task.insertFrag,  '',  task.panelCondition);

    else if (state && state.length) {  // ==If it is an array.
        for (var i = 0;  i < state.length;  i++) {
            var frag = task.insertVariants[state[i]];
            insertFrag(task.findTag,  frag,  TagIndexDelimiter + i,  i + ': ' + state[i]);
        }
    }

    else if (state && typeof(state) == 'number') {
        for (var i = 0;  i < state;  i++) {
            insertFrag(task.findTag,  task.insertFrag,  TagIndexDelimiter + i,  task.panelCondition + ' ' + i);
        }
    }
}


/**
 * + Arg. `tagExt`:
 *     For arrays in `panelState`, the same tag-name should not be inserted
 *     multiple times. We prevent this by adding `tagExt` (=array index) to
 *     each tag that occurs in `frag`.
 * + Arg. `str`: is just for logging.
 */
function insertFrag(findTag, frag, tagExt, str) {
    ///log('attaching to ' + findTag + ': ' + str);

    // Clone: ensures that changes to what we insert, won't pollute the original `frag`-Object.
    frag = clone(frag);

    // Determine where to attach vsm-`frag`'s head-term (=for now just term 0) to.
    var findTagPos = vsmSent.terms.findIndex(term => term.tag == findTag);
    if (findTagPos < 0)  return;  // Can't insert if findTag isn't present in vsmSent.

    // Determine where to insert `frag`'s terms-after-its-head.
    var insertTailPos = whereToInsertFragTail(frag);

    // If in array-mode (tagExt!=''), add an index to any inserted tags.
    frag.terms.forEach(term => {
        if (term.tag)  term.tag = term.tag + tagExt;
    });

    // Insert `frag`'s terms. Exclude the 1st term (by default, for now).
    var preInsert  = vsmSent.terms.slice(0, insertTailPos);
    var insert     = frag.terms.slice(1, frag.terms.length);
    var postInsert = vsmSent.terms.slice(insertTailPos, vsmSent.terms.length);
    vsmSent.terms = preInsert.concat(insert).concat(postInsert);

    // Shift `vsmSent`'s existing connectors accordingly.
    var shift = insert.length;
    vsmSent.conns.forEach(conn => {
        conn.pos = conn.pos.map(pos => pos < insertTailPos ? pos : pos + shift);
    });

    // Add `frag`'s connectors, shifted accordingly.
    frag.conns.forEach(conn => {
        conn.pos = conn.pos.map(pos => pos == 0 ? findTagPos : pos + insertTailPos - 1);
        vsmSent.conns.push(conn);
    });
}


/**
 * Scans the current `vsmSent`'s term-tags, and determines the position
 * where the terms behind `frag`'s 'head' (term===0) should be inserted,
 * E.g.:
 *   + 'sourceType'-related terms should go right after 'source'.
 *   + 'reference'-related terms should go not only after 'effect',
 *      but also after 'target', and also after e.g. 'reference__1'.
 */
function whereToInsertFragTail(frag) {
    // Currently, frag's head is always term nr. 0. So we can just search for
    // the first tag found in frag's terms, to determine where to insert the frag's tail.
    fragTag = '';
    for (var i = 0;  i< frag.terms.length; i++) {
        var tag = frag.terms[i].tag;
        if (tag)  { fragTag = tag;  break; }
    }

    // Get a list of all tags that should go before it. (This list includes the tag itself too).
    i = (tagOrder.indexOf(fragTag) + 1) || tagOrder.length;
    var tagsBefore = tagOrder.slice(0, i);

    // A hard-coded hack (until a more general template-generator would be built):
    // insert a new Mod after all Mod, and after all ModRes/ModPos too.
    if (tagsBefore.includes('sourceModificationMod')) {
      tagsBefore.push('sourceModificationModRes');
      tagsBefore.push('sourceModificationModPos');
    }
    if (tagsBefore.includes('targetModificationMod')) {
      tagsBefore.push('targetModificationModRes');
      tagsBefore.push('targetModificationModPos');
    }

    // In the current `vsmSent`, find the position of the last term that has any of those tags.
    // Take into account that some tags can have an appended array-index.
    var insertPos = 0;
    vsmSent.terms.forEach((term, i) => {
        if (!term.tag)  return;
        tag = term.tag.split(TagIndexDelimiter)[0];
        if (tagsBefore.includes(tag))  insertPos = i;
    });

    ///log('tag: ' + fragTag + ', before: ' + tagsBefore + ', insertPos: ' + (insertPos + 1));
    return insertPos + 1;
}


function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function log(s) {
    console.log(s);
}

/**
 * Creation and removal of biological modification checkboxes
 */
function createRemoveState(checkBox, divTagListStates, currentState) {
    //Get the number of biological modifications in current list of source or target states (divTagListStates)
    var count = parseInt(($('#' + currentState.id).parent().children().size()));

    if($('#' + checkBox.id).is(':checked')){
        //Add a select option to annotate the biological modification type: mod, modpos, modres, modposres
        count = count + 1;
        //remove last character which correspond to the number of the biological modification
        nameCheckbox = checkBox.id.substring(0, checkBox.id.length-1);
        //id of biological modification without the number of the biological modification
        idState = currentState.id.substring(0, currentState.id.length-1);

        //Create select options:
        if ($('#' + currentState.id).has('select').length === 0){
            $('#' + currentState.id+':last').find('br').remove();
            var options =
                "<select id = select" + checkBox.id + " onchange = 'updatePanelState(this)'> " +
                "<option style='display:none'></option> " +
                "<option value='mod'>mod</option> " +
                "<option value='modres'>mod+res</option> " +
                "<option value='modpos'>mod+pos</option> " +
                "<option value='modrespos'>mod+res+pos</option> "+
                "</select> <br> <br> ";
            $('#' + currentState.id).append(options);
        }

        //Create new checkbox for possible new biological modification that can be checked then annotated.
        var newState =
            "<div id='"+ idState + count + "'> " +
            "<input type='checkbox' id='" + nameCheckbox + count + "' name='" + checkBox.name + "' onchange='createRemoveState(this," + divTagListStates.id + ", " + idState + count +")' > " +
            "<label for='" + nameCheckbox + count + "' >" + checkBox.name + " </label> <br> <br> " +
            "</div> ";
        $('#' + divTagListStates.id).append(newState);

        //Disable previous checkboxes to avoid identifier issues when checkboxes are removed.
        for(i = 1; i < parseInt(($('#'+ divTagListStates.id).children().size()))-1; i ++){
            document.getElementById(checkBox.id.substring(0, checkBox.id.length-1)+i).disabled = true;
        }
    }
    else{ //unchecking a checkbox removes the following checkbox and the current checkbox's "select"

        //Enable the second preceding checkbox to be clickable again
        if((count-2) !== 0){
            document.getElementById(checkBox.id.substring(0, checkBox.id.length-1)+(count-2)).removeAttribute('disabled');
        }
        //Update the 'sourceModification' or 'targetModification' array in 'panelState' to remove the selected option in the checkbox
        updatePanelState(checkBox);
        $('#' + currentState.id+':last').find('select').remove(); //remove 'select' options
        $('#' + divTagListStates.id).children().last().remove(); //remove last label of checkbox
    }
}


function updatePanelState(element){
    if(element.type === 'checkbox'){
        if($('#' + element.id).is(':checked')){
            //when a checkbox is checked, update the state of the corresponding key in the panel to 'true'
            panelState[element.id] = true;
        }
        else{
            //Check case where a biological modification checkbox is unchecked
            if(element.id.substring(0, element.id.length-1) === 'sourceModification' || element.id.substring(0, element.id.length-1) === 'targetModification'){
                if($(element).parent().find('option:selected')[0].value !== ""){ //an option has been selected: mod || modpos || modres || modposres
                    state = element.id.substring(0, element.id.length-1); //'sourceModification' or 'targetModification'
                    //Get the value to remove from the 'select' option
                    valueToRemove = $(element).parent().find('option:selected')[0].value;
                    indexValueToRemove = panelState[state].indexOf(valueToRemove);
                    panelState[state].splice(panelState[state].indexOf(valueToRemove),1);
                }
            }
            else{
                //when a checkbox is unchecked, update the state of the corresponding key in the panel to 'false'
                panelState[element.id] = false;
            }
        }
    }
    else if(element.type === 'select-one'){
        //when the type of metadata about a biological modification is selected AND if the checkbox of the biological modification is checked, add the type to the corresponding key in the panel.
        stateCheckbox = $(element).parent().find('input:checkbox')[0];
        panelState[stateCheckbox.id.substring(0, stateCheckbox.id.length-1)].push(element.options[element.selectedIndex].value) ;
        document.getElementById(element.id).disabled = true;
    }
    else if(element.type === 'number'){
        panelState[element.id] = parseInt(element.value);
    }

    updateVsmBox();
}
