# The causalBuilder interface

[![Build Status](https://travis-ci.org/MI2CAST/causalBuilder.svg?branch=master)](https://travis-ci.org/MI2CAST/causalBuilder)
[![License](https://img.shields.io/github/license/MI2CAST/causalBuilder)](LICENSE.md)
![Repo size](https://img.shields.io/github/repo-size/MI2CAST/causalBuilder)

An intuitive interface for the curation of causal statements.

## Introduction
The causalBuilder is a web application that uses the [VSM](https://github.com/vsmjs/) framework to facilitate the curation of causal statements following the [MI2CAST](https://github.com/MI2CAST/MI2CAST) checklist.

## Access
The web application is available at: [mi2cast.github.io/causalBuilder](https://mi2cast.github.io/causalBuilder).

## Documentation
See [the Documentation page](https://mi2cast.github.io/causalBuilder/documentation) for instructions on how to build a causal statement from the interface.

## Dependencies
The causalBuilder features are enables thanks to the use multiple packages:
* repositories from the [UniBioDicts project](https://github.com/UniBioDicts), that permit the access to biological ontologies and controlled vocabularies
* the [vsm-box](https://github.com/vsmjs/vsm-box) repository, a user-friendly web-component that allows the curation of knowledge into both computer-readable and human-readable format.
* the [export-causal-formats](https://github.com/vtoure/converter-causal-formats) repository, that enables to download the curated statements into different formats (causal-json and MITAB2.8).

## Contribution
We welcome contributions, bug reports and (to the best of our ability!) feature requests - see [CONTRIBUTING.md](CONTRIBUTING.md).

## License
This project is licensed under the AGPL-3.0 license - see [LICENSE.md](LICENSE.md).

## Maintainer
Vasundra Touré, [vasundra.toure@ntnu.no](mailto:vasundra.toure@ntnu.no).
