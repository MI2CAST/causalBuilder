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
> ![Causal statement](https://github.com/vtoure/causalBuilder/raw/master/images/causal_statement.png "Description of a causal statement.")
>
> __In more details__: A molecular interaction causal statement can be decomposed into a molecular interaction and a causal statement. The __molecular interaction__ covers undirected interactions between biological entities (e.g., protein, chemical, gene, transcript, complex), whether they are with or without physical interactions. The __causal statement__ adds a causal aspect to the molecular interaction with a regulatory event and a direction of the regulation, i.e., a biological entity A (called source) regulating a biological entity B (called target). Furthermore, a causal statement describes in addition contextual information to enrich the statement.
>
> To know more about the minimum set of information to annotate about a molecular interaction causal statement, check [MI2CAST](https://github.com/vtoure/MI2CAST).

## What is VSM (Visual Syntax Method)?
> VSM is a general framework for communicating pieces of information that are both human and computer understandable. VSM defines three components:
> * a VSM-term: association of a term (human-readable) and an identifier (machine-readable),
> * a VSM-connector: grouping of VSM-terms with semantics,
> * a VSM-sentence: association of VSM-terms connected with VSM-connectors.
>
> ![VSM box](https://github.com/vtoure/causalBuilder/raw/master/images/VSM/pdf "Example of a VSM-sentence with VSM-terms, VSM-connectors.")
>
> The causalBuilder is built on top of the VSM framework to facilitate the annotation of causal statements with contextual information. CausalBuilder generates on-demand templates of VSM sentences to be filled in by the user.
>
> ![Minimum statement VSM](https://github.com/vtoure/causalBuilder/raw/master/images/minimum_statement_VSM.pdf)
>
> To know more about VSM, check the [VSM introduction](http://scicura.org/vsm/intro.html).


## How to use the web application?
Go to the [causalBuilder home page](https://vtoure.github.io/causalBuilder) and follow the steps below:

### 1. Select all the terms to add in the causal statement

#### 1.1 Adding a term from a checkbox
Click on the desired checkbox to select annotation to be added in the causal statement. For instance, if you would like to annotate the biological type of a source entity, select the *biological type* checkbox under *Source Entity*.

![Checkbox](https://github.com/vtoure/causalBuilder/raw/master/images/checkbox.pdf "The Biological type of source entity checkbox is checked.")


#### 1.2 Adding a biological state
To add a biological state, whether it belongs to the source entity or the target entity, first check the *biological state* box and then select the type of annotation in the drop-down list that appears: 
* state with modification information only (*mod*).  
*Modification corresponds to the chemical modification affecting the entity (e.g., phosphorylation, acetylation).*
* state with modification and residue information (*mod+res*).  
*The residue corresponds to the modified amino acid of the entity (e.g., histidine, serine).*
* state with modification and position information (*mod+pos*).  
*The position corresponds to the position of the modified amino acid in the entity.*
* state with modification, residue and position information (*mod+res+pos*).

#### 1.3 Adding reference(s) and evidence(s)
A causal statement can have 0, 1 or many references and/or evidences. Indicate the number of *reference* and *evidence* metadata wished to annotate by entering a number or by using the arrow on the right side of the box. By default, the amount is set to zero.  


When a checkbox is checked, a type selected or a number added in the reference/evidence, see that the VSM box is automatically updated to insert the blocks of information that you will annotate.

### 2. Fill the VSM template


### 3. Load causal statement in the desired format
CausalBuilder can generate XXX and XXX files. All information filled in the VSM template will be translated accordingly in these file formats.

__Warning__: If the VSM template is manually modified (terms are added and do not come from step 1.) the new added terms will not be taken into account in the downloaded file(s).


## Questions? Contact us!
Vasundra Touré: <vasundra.toure@ntnu.no>

