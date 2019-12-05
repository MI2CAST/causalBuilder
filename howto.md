---
layout: default
title: How to?
permalink: /howto
---

# How to?
Some tricks to effectively annotate different information about a molecular causal interaction using causalBuilder.

#### How to annotate an entity?
1. Select the database based on the type of entity to be annotated. For instance, to annotate a protein, select _Uniprot_.
2. There are several ways to optimize the search for a specific entity in the VSM-box, from the most precise to the less specific search: 
    1. search by the identifier (e.g., P31750)
    2. search by the name (e.g., AKT1)

Trick: for Uniprot, using the _'Entry name'_ provides always only one result! For instance, _AKT1\_mouse_:

<img src="{{site.url}}/images/howto/entry_name.gif" id="gif" alt="Minimum causal statement with VSM" width="700"/>


#### How to annotate the biological type of an entity?
By default, the biological type of an entity is determined by the ontology used. For instance, a source entity annotated with a Uniprot identifier is considered as a protein. The mapping of ontologies and biological type is provided in the Table 1 below: 

In the case when the curators knows that the ontology used to annotate an entity DOES NOT corresponds to its real biological type, then the real biological type of the entity should be annotated. For instance, if an article assesses the causal regulation of a transcript but the transcript identifier is unknown or not mentioned in the paper, then the curator would use the identifier of the gene to annotate the target entity, because the gene is most likely to be known. In this case, the biological type of the target entity should be annotated as "ribonucleic acid" ([http://purl.obolibrary.org/obo/MI_2233](http://purl.obolibrary.org/obo/MI_2233)) if following the PSI-MI.

#### How to annotate Taxon?
