---
layout: default
---

Curation interface for generating customized molecular causal statements. The causal statements are compatible with the MI2CAST (Minimum Information about a Molecular Interaction Causal Statement) checklist available in [github](https://github.com/vtoure/MI2CAST) and take advantage of the [VSM framework](https://github.com/vsmjs/) to create causal templates.

# Select the terms to add in the causal statement

<script src="https://unpkg.com/vsm-dictionary-bioportal@1.0.1/dist/vsm-dictionary-bioportal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-cacher@1.2.0/dist/vsm-dictionary-cacher.min.js"></script>
<script src="https://unpkg.com/vsm-box@0.3.1/dist/vsm-box.standalone.min.js"></script>

<script>
  var vsmbox;

  window.onload = function() {
    vsmbox = document.getElementById('vsm-box');
    //vsmbox.sizes = {connFootDepth:28, theConnsLevelHeight:30}; 
    

    var VsmDictionaryBioPortalCached =
      VsmDictionaryCacher( VsmDictionaryBioPortal, { predictEmpties: false } );

    vsmbox.vsmDictionary = new VsmDictionaryBioPortalCached({
      apiKey: '5904481f-f6cb-4c71-94d8-3b775cf0f19e'
    });
    //vsmbox.vsmDictionary.bioPortalDefaultPageSize = 20;
    
    vsmbox.initialValue = {
      terms: [
        {},
        {queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI' ] }}},
        {}
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };
  }

  function fillVsmBox(){
    vsmbox.initialValue = {
      terms: [
        {},
        { str: 'up-regulates', classID: 'http://purl.obolibrary.org/obo/MI_2235', instID: null },
        {}
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };
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
