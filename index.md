---
layout: default
---

Curation interface for generating customized molecular causal statements. The causal statements are compatible with the MI2CAST (Minimum Information about a Molecular Interaction Causal Statement) checklist available in [github](https://github.com/vtoure/MI2CAST) and take advantage of the [VSM framework](https://github.com/vsmjs/) to create causal templates.

# Select the terms to add in the causal statement

<html lang="en-US">
  <head>
    <meta charset="UTF-8">

    <!-- Begin Jekyll SEO tag v2.5.0 -->
    <title>CausalBuilder | Curation interface for molecular causal statements</title>
    <meta name="generator" content="Jekyll v3.8.5" />
    <meta property="og:title" content="CausalBuilder" />
    <meta property="og:locale" content="en_US" />
    <meta name="description" content="Curation interface for molecular causal statements" />
    <meta property="og:description" content="Curation interface for molecular causal statements" />
    <link rel="canonical" href="https://vtoure.github.io/causalBuilder/" />
    <meta property="og:url" content="https://vtoure.github.io/causalBuilder/" />
    <meta property="og:site_name" content="CausalBuilder" />
    <script type="application/ld+json">
    {"@type":"WebSite","url":"https://vtoure.github.io/causalBuilder/","name":"CausalBuilder","description":"Curation interface for molecular causal statements","headline":"CausalBuilder","@context":"http://schema.org"}</script>
    <!-- End Jekyll SEO tag -->

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#157878">
    <link rel="stylesheet" href="/causalBuilder/assets/css/style.css?v=17e7c9bf623362538402a0bd2a2ec7c366af5091">

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
            {queryOptions: {
        filter: { dictID: [ 'http://data.bioontology.org/search?q=regulates&ontologies=MI' ] }}},
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
      
      function doTypeSource(checkboxElem){
        if(checkboxElem.checked){
          vsmbox.initialValue = {
          terms: [
            {},
            { str: 'is a', classID: null, instID: null },
            {queryOptions: {
        	filter: { dictID: [ 'http://data.bioontology.org/ontologies/MI' ] }}}
          ],
          conns: [
            { type: 'T', pos: [ 0, 1, 2 ] }
          ]
          };
        }
        else{
         //remove annotation biological type source
         }
      }
    </script>
  </head>
  <body>
    <section class="main-content">
	<table style="width:100%" border="0">
  		<tr>
	  		<th>Source entity</th>
			<th>Target entity</th> 
			<th>Regulation</th>
		    <th>Causal statement</th>
		</tr>
		<tr>
			<th><input type="checkbox" name="typesource" value="typesource" onchange="doTypeSource(this)" /> Biological type <br /></th>
			<th><input type="checkbox" name="typetarget" value="typetarget" /> Biological type <br /> </th>
			<th></th>
			<th><input type="checkbox" name="reference" value="reference" /> Reference(s) (pubmed) <br /> 
			    <input type="number" id="nbPubmed" name="nbPubmed" min="0" max="10" placeholder="Nb of pmids" /> </th>
		</tr>
		<tr>
			<th><input type="checkbox" name="activitySource" value="activitySource" /> Biological activity <br /></th>
			<th><input type="checkbox" name="activityTarget" value="activityTarget" /> Biological activity <br /></th>
			<th><input type="checkbox" name="mechanism" value="mechanism" /> Biological mechanism <br /></th>
			<th><input type="checkbox" name="assertion" value="assertion" /> Assertion <br />
			 	<input type="number" id="nbAssertion" name="nbAssertion" min="0" max="10" placeholder="Nb of assertions" /> </th>
		</tr>
		<tr>
			<th><input type="checkbox" name="stateSource" value="stateSource" /> Biological state <br />
			    <input type="number" id="nbStateSource" name="nbStateSource" min="0" max="10" placeholder="Nb of states" /></th>
			<th><input type="checkbox" name="statetarget" value="statetarget" /> Biological state <br />
			 	<input type="number" id="nbStateTarget" name="nbStateTarget" min="0" max="10" placeholder="Nb of states" /></th>
			<th></th>
			<th><input type="checkbox" name="expEvidence" value="expEvidence" /> Experimental evidence <br />
			 	<input type="number" id="nbexpEvidence" name="nbexpEvidence" min="0" max="10" placeholder="Nb of experimental evidences" /> </th>	
		</tr>
		<tr>
			<th><input type="checkbox" name="expSetupSource" value="expSetupSource" /> Experimental setup <br /></th>
			<th><input type="checkbox" name="expSetupTarget" value="expSetupTarget" /> Experimental setup <br /></th>
			<th></th>
		</tr>

	  	<tr>
			<th><input type="checkbox" name="speciesSource" value="speciesSource" /> Species <br /> </th>
			<th><input type="checkbox" name="speciesTarget" value="speciesTarget" /> Species <br /> </th>
			<th><input type="checkbox" name="speciesReg" value="speciesReg" /> Species <br /> </th>
	  	</tr>
	  	<tr>
			<th><input type="checkbox" name="compartmentSource" value="compartmentSource" /> Compartment <br /> </th>
			<th><input type="checkbox" name="compartmentTarget" value="compartmentTarget" /> Compartment <br /> </th>
			<th><input type="checkbox" name="compartmentReg" value="compartmentReg" /> Compartment <br /> </th>
	  	</tr>
	  	<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="cellLine" value="cellLine" /> Cell line <br /> </th>
		</tr>
		<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="cellType" value="cellType" /> Cell Type <br /> </th>
		</tr>
		<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="tissueType" value="tissueType" /> Tissue type <br /> </th>
		</tr>

	</table>
	<br />

	 
	<vsm-box id="vsm-box"></vsm-box>
	 
     <footer class="site-footer">
      <span class="site-footer-owner"><a href="https://github.com/vtoure/causalBuilder">causalBuilder</a> is maintained by <a href="https://github.com/vtoure">vtoure</a>.</span>
      <span class="site-footer-credits">This page was generated by <a href="https://pages.github.com">GitHub Pages</a>.</span>
     </footer>
    </section>

    
  </body>
</html>
