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

    var VsmDictionaryBioPortalCached =
      VsmDictionaryCacher( VsmDictionaryBioPortal, { predictEmpties: false } );

    vsmbox.vsmDictionary = new VsmDictionaryBioPortalCached({
      apiKey: '5904481f-f6cb-4c71-94d8-3b775cf0f19e'
    });
    //vsmbox.vsmDictionary.bioPortalDefaultPageSize = 20;
    
    vsmbox.initialValue = {
      terms: [
        {},
        {queryOptions: { filter: { dictID: [ 'http://data.bioontology.org/search?q=regulates&ontologies=MI' ] }}},
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
  <input type="checkbox" id="typesource" /> Biological type <br> <br>
  <input type="checkbox" name="activitySource" id="activitySource" /> Biological activity <br> <br>
  <input type="checkbox" name="stateSource" id="stateSource" /> Biological state
  <input type="number" id="nbStateSource" name="nbStateSource" min="0" max="10" placeholder="Nb of states" /> <br> <br>
  <input type="checkbox" name="expSetupSource" id="expSetupSource" /> Experimental setup <br> <br>
  <input type="checkbox" name="speciesSource" id="speciesSource" /> Species <br> <br>
  <input type="checkbox" name="compartmentSource" id="compartmentSource" /> Compartment <br> <br>
  </div>
  
  <div class="column">
  <h3> Target Entity </h3>
  <input type="checkbox" name="typetarget" id="typetarget" /> Biological type <br> <br>
  <input type="checkbox" name="activityTarget" id="activityTarget" /> Biological activity <br> <br>
  <input type="checkbox" name="statetarget" id="statetarget" /> Biological state
  <input type="number" id="nbStateTarget" name="nbStateTarget" min="0" max="10" placeholder="Nb of states"/> <br> <br>
  <input type="checkbox" name="expSetupTarget" id="expSetupTarget" /> Experimental setup <br> <br>
  <input type="checkbox" name="speciesTarget" id="speciesTarget" /> Species <br> <br>
  <input type="checkbox" name="compartmentTarget" id="compartmentTarget" /> Compartment <br> <br>
  </div>
  
  <div class="column">
  <h3> Regulation</h3>
  <input type="checkbox" name="mechanism" id="mechanism" /> Biological mechanism <br> <br>
  <input type="checkbox" name="speciesReg" id="speciesReg" /> Species <br> <br>
  <input type="checkbox" name="compartmentReg" id="compartmentReg" /> Compartment <br> <br>
  <input type="checkbox" name="cellLine" id="cellLine" /> Cell line <br> <br>
  <input type="checkbox" name="cellType" id="cellType" /> Cell Type <br> <br>
  <input type="checkbox" name="tissueType" id="tissueType" /> Tissue type <br> <br>
  </div>
  
  <div class="column">
  <h3> Causal Statement</h3>
  <input type="checkbox" name="reference" id="reference" /> Reference(s)
  <input type="number" id="nbPubmed" name="nbPubmed" min="0" max="10" placeholder="Nb of pmids" /> <br> <br>
  <input type="checkbox" name="assertion" id="assertion" /> Assertion <br />
  <input type="number" id="nbAssertion" name="nbAssertion" min="0" max="10" placeholder="Nb of assertions" /> <br> <br>
    <input type="checkbox" name="expEvidence" id="expEvidence" /> Experimental evidence 
  <input type="number" id="nbexpEvidence" name="nbexpEvidence" min="0" max="10" placeholder="Nb of exp. evidences" />
  </div>
</div> 

 <button type="button" id="button" onclick="getChecked();">Get VSM template!</button> 

<vsm-box id="vsm-box"></vsm-box>
