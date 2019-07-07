---
layout: default
---

Curation interface for generating customized molecular causal statements. The causal statements are compatible with the MI2CAST (Minimum Information about a Molecular Interaction Causal Statement) checklist available on [GitHub](https://github.com/vtoure/MI2CAST) and take advantage of the [VSM framework](https://github.com/vsmjs/) to generate customized causal statement VSM-templates.

# Select the terms to add in the causal statement

<script src="https://unpkg.com/vsm-dictionary-bioportal@1.1.0/dist/vsm-dictionary-bioportal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-cacher@1.2.0/dist/vsm-dictionary-cacher.min.js"></script>
<script src="https://unpkg.com/vsm-box@0.3.1/dist/vsm-box.standalone.min.js"></script>

<script src="template-builder.js"></script>

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
