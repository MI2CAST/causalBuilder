---
layout: default
---

<script src="https://unpkg.com/vsm-dictionary-complex-portal@^1.0.1/dist/vsm-dictionary-complex-portal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-ensembl-genomes@^1.0.2/dist/vsm-dictionary-ensembl-genomes.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-ensembl@^1.0.3/dist/vsm-dictionary-ensembl.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-rnacentral@^1.0.1/dist/vsm-dictionary-rnacentral.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-uniprot@^1.0.5/dist/vsm-dictionary-uniprot.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-bioportal@^1.2.0/dist/vsm-dictionary-bioportal.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-pubmed@^1.0.0/dist/vsm-dictionary-pubmed.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-cacher@^1.2.1/dist/vsm-dictionary-cacher.min.js"></script>
<script src="https://unpkg.com/vsm-dictionary-combiner@^1.0.1/dist/vsm-dictionary-combiner.min.js"></script>
<script src="https://unpkg.com/vsm-box@^1.0.0/dist/vsm-box.standalone.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.7.1.min.js"></script>
<link href="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Multi-Select-List-with-Checkboxes-MultiSelect/jquery.multiselect.css" rel="stylesheet" type="text/css">
<script src="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Multi-Select-List-with-Checkboxes-MultiSelect/jquery.multiselect.js"></script>
<script src="https://unpkg.com/converter-causal-formats@^1.0.2/dist/converter-causal-formats.min.js"></script>
<script src="https://unpkg.com/vsm-json-pretty@^1.0.0/dist/vsm-json-pretty.min.js"></script>
<script src="js/VsmCausalTemplate.js"></script>
<script src="js/ExportCausalJson.js"></script>

### 1. Select the terms to add in the causal statement

<div class="row">
  <div class="column">
    <h4>  Source entity </h4>
      <div class="dropdownbox">
        <select autocomplete="off" name="source_database" multiple class="form-control" id="source_db">
          <option value="sourceUniprot">UniProt</option>
          <option value="sourceEnsembl">Ensembl</option>
          <option value="sourceEnsemblGen">Ensembl Genomes</option>
          <option value="sourceRnacentral">RNAcentral</option>
          <option value="sourceChebi">ChEBI</option>
          <option value="sourceComplexportal">Complex Portal</option>
          <option value="sourceGO">Gene Ontology</option>
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
      <label><input type="checkbox" id="sourceTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="sourceCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
      Experimental setup <br><input title= "Experimental setup" type="number" id="sourceExperiment" min="0" max="10" value="0" onchange='updatePanelState(this);' /> <br> <br>

  </div>
  <div class="column">
    <h4>  Target entity </h4>
      <div class="dropdownbox">
        <select autocomplete="off" name="target_database" multiple class="form-control" id="target_db">
          <option value="targetUniprot">UniProt</option>
          <option value="targetEnsembl">Ensembl</option>
          <option value="targetEnsemblGen">Ensembl Genomes</option>
          <option value="targetRnacentral">RNAcentral</option>
          <option value="targetChebi">ChEBI</option>
          <option value="targetComplexportal">Complex Portal</option>
          <option value="sourceGO">Gene Ontology</option>
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
      <label><input type="checkbox" id="targetTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="targetCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
      Experimental setup <br><input title= "Experimental setup" type="number" id="targetExperiment" min="0" max="10" value="0" onchange='updatePanelState(this);' /> <br> <br>
           
  </div>
  <div class="column">
    <h4>Causal relationship</h4>
      <label><input type="checkbox" id="effectMechanism" onchange='updatePanelState(this);' /> Biological mechanism </label><br> <br>
      <label><input type="checkbox" id="effectTaxon" onchange='updatePanelState(this);' /> Taxon </label><br> <br>
      <label><input type="checkbox" id="effectCompartment" onchange='updatePanelState(this);' /> Compartment </label><br> <br>
      <label><input type="checkbox" id="effectCellType" onchange='updatePanelState(this);' /> Cell type or cell line </label><br> <br>
      <label><input type="checkbox" id="effectTissue" onchange='updatePanelState(this);' /> Tissue type </label><br> <br>
  </div>
  
  <div class="column">
    <h4> Causal statement</h4>
      Reference(s) <br>
      <input title= "Number of references: PMIDs, DOIs" type="number" id="reference" min="1" max="10" value="1" onchange='updatePanelState(this);' /> <br> <br>
      Evidence <br>
      <input title="Number of evidence codes" type="number" id="evidence"  min="1" max="10" value="1" onchange='updatePanelState(this);' />     
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


### 2. Fill the vsm-box
<vsm-box id="vsm-box"></vsm-box>
<br>


### 3. Download the causal statement
<button onclick="exportVsmJson();">VSM-JSON</button><button
style="margin-left:1px;" onclick="exportVsmLightJson();">-light</button>
<button onclick="exportCausalJson();">causal-JSON</button>
<button onclick="exportMitab28();">MITAB2.8</button>

