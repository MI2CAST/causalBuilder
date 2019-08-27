---
layout: default
---

<script src="https://unpkg.com/vsm-dictionary-complex-portal@^1.0.1/dist/vsm-dictionary-complex-portal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-ensembl-genomes@^1.0.2/dist/vsm-dictionary-ensembl-genomes.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-ensembl@^1.0.3/dist/vsm-dictionary-ensembl.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-rnacentral@^1.0.1/dist/vsm-dictionary-rnacentral.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-uniprot@^1.0.5/dist/vsm-dictionary-uniprot.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-bioportal@^1.1.3/dist/vsm-dictionary-bioportal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-cacher@^1.2.1/dist/vsm-dictionary-cacher.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-combiner@^1.0.1/dist/vsm-dictionary-combiner.min.js"></script>
<script src="https://unpkg.com/vsm-box@^1.0.0/dist/vsm-box.standalone.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.7.1.min.js"></script>
<link href="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Multi-Select-List-with-Checkboxes-MultiSelect/jquery.multiselect.css" rel="stylesheet" type="text/css">
<script src="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Multi-Select-List-with-Checkboxes-MultiSelect/jquery.multiselect.js"></script>


### 1. Select the terms to add in the causal statement

<script>
  // initialize the vsm-dictionaries
  var VsmDictUniprot     	= new VsmDictionaryUniprot();
  var VsmDictComplexPortal  = new VsmDictionaryComplexPortal();
  var VsmDictEnsemblGenomes = new VsmDictionaryEnsemblGenomes();
  var VsmDictEnsembl    	= new VsmDictionaryEnsembl();
  var VsmDictRNAcentral  	= new VsmDictionaryRNAcentral();
  var key = '5904481f-f6cb-4c71-94d8-3b775cf0f19e';
  var VsmDictBioPortal      = new VsmDictionaryBioPortal({ apiKey: key });
  
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
      VsmDictEnsemblGenomes
    ],
    errorIfAllErrors: true
  });

  var vsmbox;      // The <vsm-box> HTML-element.
  var panelState;  // An object that represents the current values in web-page's template configuration panel.

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
      sourceExperiment: false,
      sourceTaxon: false,
      sourceCompartment: false,
      targetType: false,
      targetActivity: false,
      targetModification: [
      ],
      targetExperiment,
      targetTaxon,
      targetCompartment,
      regulationMechanism: false,
      regulationTaxon: false,
      regulationCompartment: false,
      regulationCellLine: false,
      regulationCellType: false,
      regulationTissue: false,
      reference: 0,
      evidence: 0
    };
  }



 /**
  * Update the VSM box whenever a change occurs in the interface that adds or removes a vsm term.
  * This function:
  * -  keeps track of annotation already entered by the user + DB selection (updateEntityDatabase())
  * - calls 'doInsertionTasks' to add/remove the vsm term.
  * - sends back the updated vsmbox
  */
  function updateVsmBox(){
    if(typeof vsmSentInBox !== "undefined"){ //there has been some annotation done in the vsmbox
      vsmSentInBox.terms.reduce((objVsm, oldVsmTerm) => {
        vsmRoot.terms.reduce((objRoot, newVsmTerm) =>{ //keep annotation about source | regulation | target
          if (oldVsmTerm.tag === newVsmTerm.tag) {
            delete oldVsmTerm.queryOptions; // to keep the database(s) selected for the entities
            // update the rest of the properties
            Object.assign(newVsmTerm, oldVsmTerm);
          }
        }, {});
        //TODO: cases with multiple tags (modification, reference & evidence)
        insertionTasks.reduce((obj_meta, newMetaTerm) =>{ //keep annotation of the rest of metadata
          if(typeof newMetaTerm.insertFrag !== "undefined"){
            if(newMetaTerm.insertFrag.terms[2].tag === oldVsmTerm.tag){
              delete oldVsmTerm.queryOptions;
              Object.assign(newMetaTerm.insertFrag.terms[2], oldVsmTerm);
            }
          }
        }, {});
      }, {});
    }

    vsmSent = clone(vsmRoot);
    insertionTasks.forEach(doInsertionTask);
    vsmbox.initialValue = vsmSent;
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
    "targetComplexportal" : "https://www.ebi.ac.uk/complexportal"
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
        X(Regulation, 'regulation', 'regulation'),
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

  const Regulation = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI', "http://data.bioontology.org/ontologies/OBOREL" ] }}
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

  const HasState = {
    str: 'has state', classID: null, instID: null
  };
  const Modification = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/PSIMOD' ] }}
  };

  const OfResidue = {
    str: 'of', classID: null, instID: null
  };
  const Residue = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/AMINO-ACID' ] }},
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
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/ECO' ] }}
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
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/UBERON' ] }}
  };

  const PartOfCellType = {
    str: 'in', classID: null, instID: null
  };
  const CellType = {
    queryOptions: { filter: { dictID: [
      'http://data.bioontology.org/ontologies/CL' ,
      'http://data.bioontology.org/ontologies/PO',
      'http://data.bioontology.org/ontologies/FAO' ] }}
  };

  const PartOfCellLine = {
    str: 'in', classID: null, instID: null
  };
  const CellLine = {
     queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/BTO' ] }}
  };

  const HasReference = {
    str: 'has reference', classID: null, instID: null
  };
  const Reference = {
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
      X(Regulation, 'regulation', 'regulation'),
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
    'regulation',
    'target',
    'targetType',
    'targetActivity',
    'targetModificationMod',
    'targetModificationModRes',
    'targetModificationModPos',
    'targetExperiment',
    'targetTaxon',
    'targetCompartment',
    'regulationMechanism',
    'regulationTaxon',
    'regulationTissue',
    'regulationCellType',
    'regulationCellLine',
    'regulationCompartment',
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
          { terms: [ 0, HasState, X(Modification, 'sourceModificationMod', 'modification') ],
            conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
          },
        'modres':
          { terms: [ 0,
              HasState, X(Modification, 'sourceModificationMod', 'modification'),
              OfResidue, X(Residue, 'sourceModificationModRes', 'residue')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modpos':
          { terms: [ 0,
              HasState, X(Modification, 'sourceModificationMod', 'modification'),
              AtPosition, X(Position, 'sourceModificationModPos', 'pos')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modrespos':
          { terms: [ 0,
              HasState, X(Modification, 'sourceModificationMod', 'modification'),
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
          { terms: [ 0, HasState, X(Modification, 'targetModificationMod', 'modification') ],
            conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
          },
        'modres':
          { terms: [ 0,
              HasState, X(Modification, 'targetModificationMod', 'modification'),
              OfResidue, X(Residue, 'targetModificationModRes', 'residue')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modpos':
          { terms: [ 0,
              HasState, X(Modification, 'targetModificationMod', 'modification'),
              AtPosition, X(Position, 'targetModificationModPos', 'pos')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modrespos':
          { terms: [ 0,
              HasState, X(Modification, 'targetModificationMod', 'modification'),
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
    
    { panelCondition: 'regulationMechanism',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, HasMechanism, X(Mechanism, 'regulationMechanism', 'mechanism') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
    { panelCondition: 'regulationTaxon',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfTaxon, X(Taxon, 'regulationTaxon', 'taxon') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
    { panelCondition: 'regulationTissue',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfTissue, X(Tissue, 'regulationTissue', 'tissue') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
    { panelCondition: 'regulationCellType',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfCellType, X(CellType, 'regulationCellType', 'cell type') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
    { panelCondition: 'regulationCellLine',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfCellLine, X(CellLine, 'regulationCellLine', 'cell line') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
    { panelCondition: 'regulationCompartment',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfCompartment, X(Compartment, 'regulationCompartment', 'compartment') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },



    // --- REGULATION extensions part 2 ---
    
    { panelCondition: 'reference',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, HasReference, X(Reference, 'reference', 'reference') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },

    { panelCondition: 'evidence',
      findTag: 'regulation',
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
   *   + 'reference'-related terms should go not only after 'regulation',
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




  // --- CODE TO EXTRACT VALUES FILLED OUT IN THE TEMPLATE ---

  /**
   * This function gets called when the content of the vsm-box changes,
   * so also when the user fills in a field.
   * It makes that `vsmSentInBox` always contains the latest data,
   * and it is from this that `extractData()` extracts what it needs.
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
  function extractData() {
    return vsmSentInBox.terms.reduce((o, term) => {
      if (term.tag) {
        var val =
          !term.str ? null :
          term.classID === undefined ? { str: term.str } :
          { str: term.str, id: term.classID };
        
        var a = term.tag.split(TagIndexDelimiter);
        if (a.length == 1) {  // Normal tag.
          o[term.tag] = val;
        }
        else {                // Array-based tag.
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
   * Export to a causal-JSON format
   */
   function exportCausalJson(){
    causalJson = {};
    causalJson.causalStatement = {};
    fillCausalJson(causalJson, extractData());
    downloadObjectAsJson(causalJson, "causalJson");
    log(causalJson);
  }

  /**
   * Taken from: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
   */
  function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function fillCausalJson(json, terms){
    for (key in terms) {
      if (terms.hasOwnProperty(key)) {
        switch(key){
          case "sourceType":
            addStatement("source", "biologicalType", terms[key], json);
            break;
          case "sourceActivity":
            addStatement("source", "biologicalActivity", terms[key], json);
            break;
          case "sourceTaxon":
            addStatement("source", "entityTaxon", terms[key], json);
            break;
           case "sourceModificationMod":
            json.causalStatement["source"]["biologicalModifications"] = {};
            for(let index of terms[key].keys()){
              json.causalStatement["source"]["biologicalModifications"]["biologicalModification"+index] = {}; 
              json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['modification'] = {};
              json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['modification']['identifier'] = terms[key][index].id;
              json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['modification']['name'] = terms[key][index].str;
            }
            break;
          case "sourceModificationModPos":
            for(let index of terms[key].keys()){
              if(index in terms[key] !== false){
              json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['position'] =  terms[key][index].str;
              }
            }
            break;
          case "sourceModificationModRes":
            for(let index of terms[key].keys()){
              if(index in terms[key] !== false){
                json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['residue'] = {};
                json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['residue']['identifier'] = terms[key][index].id;
                json.causalStatement["source"]["biologicalModifications"]['biologicalModification'+index]['residue']['name'] = terms[key][index].str;
              }
            }
            break;
          case "sourceCompartment":
            addStatement("source", "entityCompartment", terms[key], json);
            break;
          case "targetType":
            addStatement("target", "biologicalType", terms[key], json);
            break;
          case "targetActivity":
            addStatement("target", "biologicalActivity", terms[key], json);
            break;
          case "targetTaxon":
            addStatement("target", "entityTaxon", terms[key], json);
            break;
          case "targetModificationMod":
            json.causalStatement["target"]["biologicalModifications"] = {};
            for(let index of terms[key].keys()){
              json.causalStatement["target"]["biologicalModifications"]["biologicalModification"+index] = {}; 
              json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['modification'] = {};
              json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['modification']['identifier'] = terms[key][index].id;
              json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['modification']['name'] = terms[key][index].str;
            }
            break;
          case "targetModificationModPos":
            for(let index of terms[key].keys()){
              if(index in terms[key] !== false){
                json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['position'] =  terms[key][index].str;
              }
            }
            break;
          case "targetModificationModRes":
            for(let index of terms[key].keys()){
              if(index in terms[key] !== false){
                json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['residue'] = {};
                json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['residue']['identifier'] = terms[key][index].id;
                json.causalStatement["target"]["biologicalModifications"]['biologicalModification'+index]['residue']['name'] = terms[key][index].str;
              }
            }
            break;
          case "targetCompartment":
            addStatement("target", "entityCompartment", terms[key], json);
            break;     
          case "regulationMechanism":
            addStatement("regulation", "biologicalMechanism", terms[key], json);
            break;
          case "regulationTaxon":
            addStatement("regulation", "regulationTaxon", terms[key], json);
            break;
          case "regulationCompartment":
            addStatement("regulation", "regulationCompartment", terms[key], json);
            break;
          case "regulationCellLine":
            addStatement("regulation", "cellLine", terms[key], json);
            break;
          case "regulationCellType":
            addStatement("regulation", "cellType", terms[key], json);
            break;
          case "regulationTissueType":
            addStatement("regulation", "tissueType", terms[key], json);
            break;
          case "reference":
            json.causalStatement["references"] = {};
            for(let index of terms[key].keys()){
              json.causalStatement["references"]["reference"+index] = terms[key][index].id;
            }
            break;
          case "evidence":
            json.causalStatement["evidences"] = {};
            for(let index of terms[key].keys()){
              json.causalStatement["evidences"]["evidence"+index] = {};
              json.causalStatement["evidences"]["evidence"+index]["identifier"] = terms[key][index].id;
              json.causalStatement["evidences"]["evidence"+index]["name"] = terms[key][index].str;
            }
            break;
          default: // term = (source | target | regulation)
            json.causalStatement[key] = {}; 
            json.causalStatement[key]['identifier'] = terms[key].id;
            json.causalStatement[key]['name'] = terms[key].str;
        }
      }
    }  
  }

  function addStatement(entity, metadata, term, json){
    json.causalStatement[entity][metadata] = {}; 
    json.causalStatement[entity][metadata]["identifier"] = term.id;
    json.causalStatement[entity][metadata]["name"] = term.str;
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
      if ($('#' + currentState.id).has('select').length == 0){ 
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
    if(element.type == 'checkbox'){ 
      if($('#' + element.id).is(':checked')){
        //when a checkbox is checked, update the state of the corresponding key in the panel to 'true'
        panelState[element.id] = true;
      }
      else{
         //Check case where a biological modification checkbox is unchecked
         if(element.id.substring(0, element.id.length-1) == 'sourceModification' || element.id.substring(0, element.id.length-1) == 'targetModification'){
           if($(element).parent().find('option:selected')[0].value != ""){ //an option has been selected: mod || modpos || modres || modposres
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
    else if(element.type == 'select-one'){
       //when the type of metadata about a biological modification is selected AND if the checkbox of the biological modification is checked, add the type to the corresponding key in the panel.
       stateCheckbox = $(element).parent().find('input:checkbox')[0];
       panelState[stateCheckbox.id.substring(0, stateCheckbox.id.length-1)].push(element.options[element.selectedIndex].value) ;
       document.getElementById(element.id).disabled = true;
    }
    else if(element.type == 'number'){
       panelState[element.id] = parseInt(element.value);
    }
    updateVsmBox();
  }


</script>

<div class="row">
  <div class="column">
    <h4>  Source Entity </h4>
      <div class="dropdownbox">
        <select name="source_database" multiple class="form-control" id="source_db">
          <option value="sourceUniprot">Uniprot</option>
          <option value="sourceEnsembl">Ensembl</option>
          <option value="sourceEnsemblGen">Ensembl genomes</option>
          <option value="sourceRnacentral">RNA central</option>
          <option value="sourceChebi">ChEBI</option>
          <option value="sourceComplexportal">Complex Portal</option>
        </select>
      </div>
      <label><input title="To annotate only when the source entity's identifier does not correspond to the exact biological type" type="checkbox" id="sourceType" onchange='updatePanelState(this);' /> Biological type </label><br> <br>
      <label><input type="checkbox" id="sourceActivity" onchange='updatePanelState(this);' /> Biological activity </label><br> <br>
      <div id="divSourceStates">
        <div id="divSourceState1">
          <input type="checkbox" name="Biological modification" id="sourceModification1" onchange='createRemoveState(this,divSourceStates, divSourceState1);' />
          <label for="sourceModification1">Biological modification  </label> <br> <br>
        </div>
      </div>
      <label><input type="checkbox" id="sourceExperiment" onchange='updatePanelState(this);' /> Experimental setup </label><br> <br>
      <label><input type="checkbox" id="sourceTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="sourceCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
  </div>
  <div class="column">
    <h4>  Target entity </h4>
      <div class="dropdownbox">
        <select name="target_database" multiple class="form-control" id="target_db">
          <option value="targetUniprot">Uniprot</option>
          <option value="targetEnsembl">Ensembl</option>
          <option value="targetEnsemblGen">Ensembl genomes</option>
          <option value="targetRnacentral">RNA central</option>
          <option value="targetChebi">ChEBI</option>
          <option value="targetComplexportal">Complex Portal</option>
        </select>
      </div>
      <label><input title="To annotate only when the target entity's identifier does not correspond to the exact biological type" type="checkbox" id="targetType" onchange='updatePanelState(this);' /> Biological type </label><br> <br>
      <label><input type="checkbox" id="targetActivity" onchange='updatePanelState(this);' /> Biological activity </label><br> <br>
      <div id="divTargetStates">
        <div id="divTargetState1">
          <input type="checkbox" name="Biological modification" id="targetModification1" onchange='createRemoveState(this,divTargetStates, divTargetState1);' />
          <label for="targetModification1">Biological modification </label> <br> <br>
        </div>
      </div>
      <label><input type="checkbox" id="targetExperiment" onchange='updatePanelState(this);' /> Experimental setup </label><br> <br>
      <label><input type="checkbox" id="targetTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="targetCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
  </div>
  <div class="column">
    <h4> Regulation</h4>
      <label><input type="checkbox" id="regulationMechanism" onchange='updatePanelState(this);' /> Biological mechanism </label><br> <br>
      <label><input type="checkbox" id="regulationTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="regulationCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
      <label><input type="checkbox" id="regulationCellLine" onchange='updatePanelState(this);' /> Cell line </label><br> <br>
      <label><input type="checkbox" id="regulationCellType" onchange='updatePanelState(this);' /> Cell Type </label><br> <br>
      <label><input type="checkbox" id="regulationTissue" onchange='updatePanelState(this);' /> Tissue type </label><br> <br>
  </div>
  
  <div class="column">
    <h4> Causal Statement</h4>
      Reference(s) <br>
      <input title= "Number of references: PMIDs, DOIs" type="number" id="reference" min="0" max="10" placeholder="0" onchange='updatePanelState(this);' /> <br> <br>
      Evidence <br>
      <input title="Number of evidence codes" type="number" id="evidence"  min="0" max="10" placeholder="0" onchange='updatePanelState(this);' />     
  </div>
</div> 

<script>

  $('select[multiple]').multiselect({
    columns: 1,
    placeholder: 'Select database(s)'
  });


  $('#source_db').on('change',function() {
    updateEntityDatabase($(this).val(), "source");
  });


  $('#target_db').on('change',function() {
    updateEntityDatabase($(this).val(), "target");
  });

</script>


### 2. Fill the VSM box
<vsm-box id="vsm-box"></vsm-box>
<br>


### 3. Download the causal statement
<button onclick="log(exportCausalJson());">causal-JSON</button>
<button onclick="log(extractData());">log data</button>