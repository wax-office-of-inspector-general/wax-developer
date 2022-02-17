---
title: WAX Contract Development Toolkit
layout: default
nav_order: 50
parent: Desarrollo de dApps
has_children: true
lang-ref: WAX Contract Development Toolkit
lang: es
---

The <a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">WAX Contract Development Toolkit (WAX-CDT)</a> includes a C/C++ API and a <a href="https://clang.llvm.org/" target="_blank">Clang</a> based set of tools used to build and deploy your smart contracts.

WAX-CDT tools are included in the **waxteam/dev** Docker image, and we also provide a standalone **waxteam/cdt** Docker image. To start an interactive WAX-CDT container, you can use the following commands:

```shell run -it --name waxcdt -v /var/share/wax:/wax waxteam/cdt bash```

Refer to our [Docker Quickstart](/es/dapp-development/docker-setup/) for more information.

If you'd like to access our sample contracts and scripts from your local drive or have a need to install WAX-CDT instead of using Docker, you can use this guide to download and optionally build the WAX-CDT source code.

<strong>Important:</strong> At this time, pre-compiled packages are not available. Support is <strong>not</strong> available when you build WAX-CDT from source.{: .label .label-yellow }

## What's Included

- A [C/C++ API library](/es/api-reference/cdt_api) to communicate with the WAX Blockchain
- Sample smart contracts to jumpstart your dApp development
- Tools to create new smart contract templates 
- CMake scripts and tools to build optimized, high-performance WASM files
- Support for Ricardian files

<!--WAX-CDT includes various **eosio** commands, built around the <a href="https://clang.llvm.org/" target="_blank">Clang</a> front-end and tooling infrastructure. This collection includes various tools to :

- **eosio-cpp:** C++ WebAssembly Compiler
- **eosio-ld:** WebAssembly Linker
- **eosio-abigen:** C++ ABI Generator

- Sample contracts and customizable **make** scripts to automatically generate WASM and ABI files.
- <a href="https://clang.llvm.org/" target="_blank">Clang</a> based tools , including


compile your smart contracts and create smart contract templates. Refer to [WAX-CDT Options](/es/tools/cdt_options) for a list of tools and parameters.

WAX-CDT includes various **eosio** commands, built around the <a href="https://clang.llvm.org/" target="_blank">Clang</a> front-end and tooling infrastructure. This collection includes various tools to :

- **eosio-cpp:** C++ WebAssembly Compiler
- **eosio-ld:** WebAssembly Linker
- **eosio-abigen:** C++ ABI Generator-->

## How it Works

When you're ready to deploy your smart contract to your local development environment or the WAX mainnet, you can use the <a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">WAX Contract Development Toolkit (WAX-CDT)</a> to convert your contract to a WebAssembly (WASM) file. You can also use WAX-CDT to create an Application Binary Interface (ABI) file that includes [Ricardian Contracts](/es/tools/ricardian_contract) and [Ricardian Clauses](/es/tools/ricardian_clause).

- **WebAssembly (WASM) Files:** A WASM file is a compact, binary format of your C++ smart contract, optimized for speed and web performance. The WAX Blockchain uses this file to execute the actions defined in your smart contract. 

- **Application Binary Interface (ABI) Files:** An ABI file is a JSON description of your smart contract's structures, types, actions, tables, and other contract definitions. This allows developers and client interfaces to easily interpret your contract's functionality. 


    ### Example ABI
    This example includes a Ricardian contract for the "hi" action and a Ricardian clause for the contract.

    ```json
    {
        "____comment": "This file was generated with eosio-abigen. DO NOT EDIT Fri Jul 19 13:36:50 2019",
        "version": "eosio::abi/1.1",
        "structs": [
            {
                "name": "hi",
                "base": "",
                "fields": [
                    {
                        "name": "user",
                        "type": "name"
                    }
                ]
            }
        ],
        "types": [],
        "actions": [
            {
                "name": "hi",
                "type": "hi",
                "ricardian_contract": "### Parameters\nInput parameters:\n\n* `user` (string to include in the output)\n\nImplied parameters: \n\n* `account_name` (name of the party invoking and signing the contract)\n\n### Intent\nINTENT. The intention of the author and the invoker of this contract is to print output. It shall have no other effect.\n\n### Term\nTERM. This Contract expires at the conclusion of code execution."
            }
        ],
        "tables": [],
        "ricardian_clauses": [
            {
                "id": "Warranty",
                "body": "The invoker of the contract action shall uphold its Obligations under this Contract in a timely and workmanlike manner, using knowledge and recommendations for performing the services which meet generally acceptable standards set forth by EOS.IO Blockchain Block Producers."
            },
            {
                "id": "Default",
                "body": "The occurrence of any of the following shall constitute a material default under this Contract:"
            },
            {
                "id": "Remedies",
                "body": "In addition to any and all other rights a party may have available according to law, if a party defaults by failing to substantially perform any provision, term or condition of this Contract, the other party may terminate the Contract by providing written notice to the defaulting party. This notice shall describe with sufficient detail the nature of the default. The party receiving such notice shall promptly be removed from being a Block Producer and this Contract shall be automatically terminated."
            },
            {
                "id": "ForceMajeure",
                "body": "If performance of this Contract or any obligation under this Contract is prevented, restricted, or interfered with by causes beyond either party's reasonable control (\"Force Majeure\"), and if the party unable to carry out its obligations gives the other party prompt written notice of such event, then the obligations of the party invoking this provision shall be suspended to the extent necessary by such event. The term Force Majeure shall include, without limitation, acts of God, fire, explosion, vandalism, storm or other similar occurrence, orders or acts of military or civil authority, or by national emergencies, insurrections, riots, or wars, or strikes, lock-outs, work stoppages, or supplier failures. The excused party shall use reasonable efforts under the circumstances to avoid or remove such causes of non-performance and shall proceed to perform with reasonable dispatch whenever such causes are removed or ceased. An act or omission shall be deemed within the reasonable control of a party if committed, omitted, or caused by such party, or its employees, officers, agents, or affiliates."
            },
            {
                "id": "DisputeResolution",
                "body": "Any controversies or disputes arising out of or relating to this Contract will be resolved by binding arbitration under the default rules set forth by the EOS.IO Blockchain. The arbitrator's award will be final, and judgment may be entered upon it by any court having proper jurisdiction."
            },
            {
                "id": "Agreement",
                "body": "This Contract contains the entire agreement of the parties, and there are no other promises or conditions in any other agreement whether oral or written concerning the subject matter of this Contract. This Contract supersedes any prior written or oral agreements between the parties."
            },
            {
                "id": "Severability",
                "body": "If any provision of this Contract will be held to be invalid or unenforceable for any reason, the remaining provisions will continue to be valid and enforceable. If a court finds that any provision of this Contract is invalid or unenforceable, but that by limiting such provision it would become valid and enforceable, then such provision will be deemed to be written, construed, and enforced as so limited."
            },
            {
                "id": "Amendment",
                "body": "This Contract may be modified or amended in writing by mutual agreement between the parties, if the writing is signed by the party obligated under the amendment."
            },
            {
                "id": "GoverningLaw",
                "body": "This Contract shall be construed in accordance with the Maxims of Equity."
            },
            {
                "id": "Notice",
                "body": "Any notice or communication required or permitted under this Contract shall be sufficiently given if delivered to a verifiable email address or to such other email address as one party may have publicly furnished in writing, or published on a broadcast contract provided by this blockchain for purposes of providing notices of this type."
            },
            {
                "id": "WaiverOfContractualRight",
                "body": "The failure of either party to enforce any provision of this Contract shall not be construed as a waiver or limitation of that party's right to subsequently enforce and compel strict compliance with every provision of this Contract."
            },
            {
                "id": "ArbitratorsFeesToPrevailingParty",
                "body": "In any action arising hereunder or any separate action pertaining to the validity of this Agreement, both sides shall pay half the initial cost of arbitration, and the prevailing party shall be awarded reasonable arbitrator's fees and costs."
            },
            {
                "id": "ConstructionAndInterpretation",
                "body": "The rule requiring construction or interpretation against the drafter is waived. The document shall be deemed as if it were drafted by both parties in a mutual effort."
            },
            {
                "id": "InWitnessWhereof",
                "body": "In witness whereof, the parties hereto have caused this Agreement to be executed by themselves or their duly authorized representatives as of the date of execution, and authorized as proven by the cryptographic signature on the transaction that invokes this contract."
            }
        ],
        "variants": [],
        "abi_extensions": []
    }
    ```



<!--A Ricardian Contract is a cryptographically signed and verified digital document that lists your smart contracts actions, intentions, terms, and conditions. Like any standard legal document, it provides a digital agreement between two parties (e.g., you and your customer), and your smart contract is the execution of this agreement.-->