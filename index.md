---
layout: default
---

Curation interface for generating customized molecular causal statements. The causal statements are compatible with the MI2CAST (Minimum Information about a Molecular Interaction Causal Statement) checklist available on [GitHub](https://github.com/vtoure/MI2CAST) and take advantage of the [VSM framework](https://github.com/vsmjs/) to generate customized causal statement VSM-templates.

# Select the terms to add in the causal statement

<script src="https://unpkg.com/vsm-dictionary-bioportal@1.1.0/dist/vsm-dictionary-bioportal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-cacher@1.2.0/dist/vsm-dictionary-cacher.min.js"></script>
<script src="https://unpkg.com/vsm-box@0.3.1/dist/vsm-box.standalone.min.js"></script>

<script src="/template-builder.js"></script>

<script>
  var vsmbox;      // The <vsm-box> HTML-element.
  var panelState;  // An Object that represents the current values in web-page's template configuration panel.

  window.onload = function() {
    vsmbox = document.getElementById('vsm-box');
    ///vsmbox.sizes = { connFootDepth: 28, theConnsLevelHeight: 30 }; 
    
    var VsmDictionaryBioPortalCached =
      VsmDictionaryCacher( VsmDictionaryBioPortal, { predictEmpties: false } );

    vsmbox.vsmDictionary = new VsmDictionaryBioPortalCached({
      apiKey: '5904481f-f6cb-4c71-94d8-3b775cf0f19e'
    });
    //vsmbox.vsmDictionary.bioPortalDefaultPageSize = 20;
    
    vsmbox.addEventListener('change',      onVsmBoxChange);  // Captures user-generated changes.
    vsmbox.addEventListener('change-init', onVsmBoxChange);  // Captures the change of placing a new template.

    fillVsmBox();
  }


  /**
   * Just a temporary hard-coded `panelState` filler. It should be calculated from the checkboxes etc.
   */
  function computePanelState() {
    panelState = {
      sourceType: true,
      sourceActivity: false,
      sourceState: [
        'mod',
        'modrespos'
      ],
      targetType: true,
      reference: 2
    };
  }





  /**
   * A collection of all the VSM-term Objects that we will use.
   */
  
  const Entity = {};

  const Regulation = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI' ] }}
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

  const PartOfSpecies = {
    str: 'is part of', classID: null, instID: null
  };
  const Species = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/NCBITAXON' ] }}
  };

  const PartOfCompartment = {
     str: 'part of', classID: null, instID: null
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
    str: 'part of', classID: null, instID: null
  };
  const Tissue = {
    queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/UBERON' ] }}
  };

  const PartOfCellType = {
    str: 'part of', classID: null, instID: null
  };
  const CellType = {
    queryOptions: { filter: { dictID: [
      'http://data.bioontology.org/ontologies/CL' ,
      'http://data.bioontology.org/ontologies/PO',
      'http://data.bioontology.org/ontologies/FAO' ] }}
  };

  const PartOfCellLine = {
    str: 'part of', classID: null, instID: null
  };
  const CellLine = {
     queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/BTO' ] }}
  };

  const HasReference = {
    str: 'has reference', classID: null, instID: null
  };
  const Reference = {
  };

  const AssessedByAssertion = {
    str: 'is assessed by', classID: null, instID: null
  };
  const Assertion = {
    queryOptions: {filter: { dictID: [ 'http://data.bioontology.org/ontologies/ECO' ] }}
  };

  const ShownInExperimentalEvidence = {
    str: 'is shown in', classID: null, instID: null
  };
  const ExperimentalEvidence = {
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
      X(Entity,     'source'),
      X(Regulation, 'regulation'),
      X(Entity,     'target'),
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
    'sourceStateMod',
    'sourceStateModRes',
    'sourceStateModPos',
    'sourceExperiment',
    'sourceSpecies',
    'sourceCompartment',
    'regulation',
    'target',
    'targetType',
    'targetActivity',
    'targetStateMod',
    'targetStateModRes',
    'targetStateModPos',
    'targetExperiment',
    'targetSpecies',
    'targetCompartment',
    'regulationMechanism',
    'regulationSpecies',
    'regulationTissue',
    'regulationCellType',
    'regulationCellLine',
    'regulationCompartment',
    'reference',
    'assertion',
    'experimentalEvidence',
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

    { panelCondition: 'sourceState',
      findTag: 'source',
      insertVariants: {
        'mod':
          { terms: [ 0, HasState, X(Modification, 'sourceStateMod', 'modification') ],
            conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
          },
        'modres':
          { terms: [ 0,
              HasState, X(Modification, 'sourceStateMod', 'modification'),
              OfResidue, X(Residue, 'sourceStateModRes', 'residue')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modpos':
          { terms: [ 0,
              HasState, X(Modification, 'sourceStateMod', 'modification'),
              AtPosition, X(Position, 'sourceStateModPos', 'position')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modrespos':
          { terms: [ 0,
              HasState, X(Modification, 'sourceStateMod', 'modification'),
              OfResidue, X(Residue, 'sourceStateModRes', 'residue'),
              AtPosition, X(Position, 'sourceStateModPos', 'position')
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

    { panelCondition: 'sourceSpecies',
      findTag: 'source',
      insertFrag:
        { terms: [ 0, PartOfSpecies, X(Species, 'sourceSpecies', 'species') ],
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

    { panelCondition: 'targetState',
      findTag: 'target',
      insertVariants: {
        'mod':
          { terms: [ 0, HasState, X(Modification, 'targetStateMod', 'modification') ],
            conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
          },
        'modres':
          { terms: [ 0,
              HasState, X(Modification, 'targetStateMod', 'modification'),
              OfResidue, X(Residue, 'targetStateModRes', 'residue')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modpos':
          { terms: [ 0,
              HasState, X(Modification, 'targetStateMod', 'modification'),
              AtPosition, X(Position, 'targetStateModPos', 'position')
            ],
            conns: [
              { type: 'T', pos: [ 0, 1, 2 ] },
              { type: 'T', pos: [ 2, 3, 4 ] }
            ]
          },
        'modrespos':
          { terms: [ 0,
              HasState, X(Modification, 'targetStateMod', 'modification'),
              OfResidue, X(Residue, 'targetStateModRes', 'residue'),
              AtPosition, X(Position, 'targetStateModPos', 'position')
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

    { panelCondition: 'targetSpecies',
      findTag: 'target',
      insertFrag:
        { terms: [ 0, PartOfSpecies, X(Species, 'targetSpecies', 'species') ],
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
    
    { panelCondition: 'regulationSpecies',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, PartOfSpecies, X(Species, 'regulationSpecies', 'species') ],
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

    { panelCondition: 'assertion',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, AssessedByAssertion, X(Assertion, 'assertion', 'assertion') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },

    { panelCondition: 'experimentalEvidence',
      findTag: 'regulation',
      insertFrag:
        { terms: [ 0, ShownInExperimentalEvidence, X(ExperimentalEvidence, 'experimentalEvidence', 'exp. evidence') ],
          conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
        }
    },
    
  ];




  function fillVsmBox(){
    computePanelState();
    
    vsmSent = clone(vsmRoot);
    insertionTasks.forEach(doInsertionTask);
    vsmbox.initialValue = vsmSent;
  }



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

</script>

<div class="row">
  <div class="column">
  <h3> Source Entity </h3>
  <input type="checkbox" id="sourceType" /> Biological type <br> <br>
  <input type="checkbox" id="sourceActivity" /> Biological activity <br> <br>
  <input type="checkbox" id="sourceState" /> Biological state <br> <br>
  <input type="checkbox" id="sourceExpSetup" /> Experimental setup <br> <br>
  <input type="checkbox" id="sourceSpecies" /> Species <br> <br>
  <input type="checkbox" id="sourceCompartment" /> Compartment <br> <br>
  </div>
  
  <div class="column">
  <h3> Target Entity </h3>
  <input type="checkbox" id="targetType" /> Biological type <br> <br>
  <input type="checkbox" id="targetActivity" /> Biological activity <br> <br>
  <input type="checkbox" id="targetState" /> Biological state <br> <br>
  <input type="checkbox" id="targetExpSetup" /> Experimental setup <br> <br>
  <input type="checkbox" id="targetSpecies" /> Species <br> <br>
  <input type="checkbox" id="targetCompartment" /> Compartment <br> <br>
  </div>
  
  <div class="column">
  <h3> Regulation</h3>
  <input type="checkbox" id="mechanism" /> Biological mechanism <br> <br>
  <input type="checkbox" id="regSpecies" /> Species <br> <br>
  <input type="checkbox" id="regCompartment" /> Compartment <br> <br>
  <input type="checkbox" id="cellLine" /> Cell line <br> <br>
  <input type="checkbox" id="cellType" /> Cell Type <br> <br>
  <input type="checkbox" id="tissueType" /> Tissue type <br> <br>
  </div>
  
  <div class="column">
  <h3> Causal Statement</h3>
   Reference(s)
   <input type="number" id="reference" min="0" max="10" placeholder="Nb of pmids" /> <br> <br>
   Assertion
   <input type="number" id="assertion"  min="0" max="10" placeholder="Nb of assertions" /> <br> <br>
   Experimental evidence 
   <input type="number" id="expEvidence" min="0" max="10" placeholder="Nb of exp. evidences" />
   
  </div>
</div> 

<vsm-box id="vsm-box"></vsm-box>
<br>
<button onclick="log(extractData());">Log data</button>
