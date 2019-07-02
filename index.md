---
layout: default
---

Build causal statements by creating à-la-carte VSM causal templates. These templates are compatible with the causal checklist available in [github](https://github.com/vtoure/MICAST).

# Select the terms to add in the causal statement

<html>
<head>
    <title>Checkboxes to create templates</title>
</head>

<body>
	<table style="width:110%" border="0">
  		<tr>
	  		<th>Source entity</th>
			<th>Target entity</th> 
			<th>Regulation</th>
		    <th>Causal statement</th>
		</tr>
		<tr>
			<th><input type="checkbox" name="typesource" value="typesource" checked onclick="return false;"> Biological type <br></th>
			<th><input type="checkbox" name="typetarget" value="typetarget" checked onclick="return false;"> Biological type <br> </th>
			<th></th>
			<th><input type="checkbox" name="reference" value="reference"> Reference(s) (pubmed) <br> 
			    <input type="number" id="nbPubmed" name="nbPubmed" min="0" max="10" placeholder="Nb of pmids"> </th>
		</tr>
		<tr>
			<th><input type="checkbox" name="activitySource" value="activitySource"> Biological activity <br></th>
			<th><input type="checkbox" name="activityTarget" value="activityTarget"> Biological activity <br></th>
			<th><input type="checkbox" name="mechanism" value="mechanism"> Biological mechanism <br></th>
			<th><input type="checkbox" name="assertion" value="assertion"> Assertion <br>
			 	<input type="number" id="nbAssertion" name="nbAssertion" min="0" max="10" placeholder="Nb of assertions"> </th>
		</tr>
		<tr>
			<th><input type="checkbox" name="stateSource" value="stateSource"> Biological state <br>
			    <input type="number" id="nbStateSource" name="nbStateSource" min="0" max="10" placeholder="Nb of states"></th>
			<th><input type="checkbox" name="statetarget" value="statetarget"> Biological state <br>
			 	<input type="number" id="nbStateTarget" name="nbStateTarget" min="0" max="10" placeholder="Nb of states"></th>
			<th></th>
			<th><input type="checkbox" name="expEvidence" value="expEvidence"> Experimental evidence <br>
			 	<input type="number" id="nbexpEvidence" name="nbexpEvidence" min="0" max="10" placeholder="Nb of experimental evidences"> </th>

			
		</tr>
		<tr>
			<th><input type="checkbox" name="expSetupSource" value="expSetupSource"> Experimental setup <br></th>
			<th><input type="checkbox" name="expSetupTarget" value="expSetupTarget"> Experimental setup <br></th>
			<th></th>
		</tr>

	  	<tr>
			<th><input type="checkbox" name="speciesSource" value="speciesSource"> Species <br> </th>
			<th><input type="checkbox" name="speciesTarget" value="speciesTarget"> Species <br> </th>
			<th><input type="checkbox" name="speciesReg" value="speciesReg"> Species <br> </th>
	  	</tr>
	  	<tr>
			<th><input type="checkbox" name="compartmentSource" value="compartmentSource"> Compartment <br> </th>
			<th><input type="checkbox" name="compartmentTarget" value="compartmentTarget"> Compartment <br> </th>
			<th><input type="checkbox" name="compartmentReg" value="compartmentReg"> Compartment <br> </th>
	  	</tr>
	  	<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="cellLine" value="cellLine"> Cell line <br> </th>
		</tr>
		<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="cellType" value="cellType"> Cell Type <br> </th>
		</tr>
		<tr>
			<th></th>
			<th></th>
			<th><input type="checkbox" name="tissueType" value="tissueType"> Tissue type <br> </th>
		</tr>

	</table>
	
	<br>
	
	 <button type="button_go">Get the VSM template!</button> 
	 
<h3> Notes </h3>
<p> </p>
</body>


</html>
