---
layout: default
title: Documentation
permalink: /documentation
---

# User documentation

<div style="text-align: justify">The causalBuilder is a web application for building molecular interaction causal statements. This curation interface allows to create customized causal statements for the annotation of selected metadata. The interface takes advantage of the <a href="https://github.com/vsmjs/"> VSM framework </a> to build VSM-templates compatible with the production of causal statements. You build the causal statement, with the metadata you wish to annotate. The causal statements generated are compatible with the MI2CAST (Minimum Information about a Molecular Interaction Causal Statement) checklist that is available on <a href="https://github.com/vtoure/MI2CAST">MI2CAST GitHub project</a>.
</div>

## What is a molecular interaction causal statement?
> __In simple words__: It is a directed interaction between biological entities where a source entity regulates the activity or the quantity of a target entity, given a certain context:
>
> ![Causal statement](https://github.com/vtoure/causalBuilder/raw/master/images/causal_statement.png "Figure 1: Representation of a causal statement.")
>
> __In more details__: A molecular interaction causal statement can be decomposed into a molecular interaction and a causal statement. The __molecular interaction__ covers undirected interactions between biological entities (e.g., protein, chemical, gene, transcript, complex), whether they are with or without physical interactions. The __causal statement__ adds a causal aspect to the molecular interaction with a regulatory event and a direction of the regulation, i.e., a biological entity A (called source) regulating a biological entity B (called target). Furthermore, a causal statement describes in addition contextual information to enrich the statement.


## How to use the web application?
Go to the [causalBuilder home page](https://vtoure.github.io/causalBuilder) and follow the steps below:

### 1. Select all the terms to add in the causal statement
Click on the desired checkboxes: if you would like to annotate the biological type of a source entity, select the "biological type" checkbox under "Source Entity".

#### 1.1 Checkbox terms
By selecting a checkbox, the VSM box below the list of terms is automatically updated to insert the blocks of information that you will later on annotate.

#### 1.2 Biological state
To add a "biological state", whether it belongs to the source entity or the target entity, check the "biological state" box and then you must select the type of annotation: 
* state with modification information only (mod).  
*Modification corresponds to the chemical modification affecting the entity (e.g., phosphorylation, acetylation).*
* state with modification and residue information (mod+res).  
*The residue corresponds to the modified amino acid of the entity (e.g., histidine, serine).*
* state with modification and position information (mod+pos).  
*The position corresponds to the position of the modified amino acid in the entity.*
* state with modification, residue and position information (mod+res+pos).

#### 1.3 Reference and Assertion
The reference and assertion of a causal statement can each be zero, one or many. Consequently, you should indicate the amount of 'reference' and 'assertion' metadata wished to annotate. By default, the amount is set to zero.

### 2. Fill the VSM template 


### 3. Load causal statement in the desired format
CausalBuilder can generate XXX and XXX files. All information filled in the VSM template will be translated accordingly in these file formats.

__Warning__: If the VSM template is manually modified (terms are added and do not come from step 1.) the new added terms will not be taken into account in the downloaded file(s).


## Questions? Contact us!
Vasundra Touré: <vasundra.toure@ntnu.no>

