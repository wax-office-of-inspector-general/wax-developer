---
title: Kit de herramientas de desarrollo de contratos WAX
layout: default
nav_order: 50
parent: dApp Development
has_children: true
lang-ref: WAX Contract Development Toolkit
lang: es-ES
---

El <a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">Kit de herramientas de desarrollo de contratos WAX (WAX Contract Development Toolkit o WAX-CDT)</a> incluye una API C/C++ y un compendio de herramientas basado en <a href="https://clang.llvm.org/" target="_blank">Clang</a>, muy útil para crear y desplegar tus smart contracts.

Las herramientas de WAX-CDT están incluidas en la imagen Docker **waxteam/dev**, y también proporcionamos una imagen Docker independiente: **waxteam/cdt**. Para iniciar un contenedor interactivo de WAX-CDT, puedes utilizar los siguientes comandos:

```shell run -it --name waxcdt -v /var/share/wax:/wax waxteam/cdt bash```

Para más información, echa un vistazo al [inicio rápido de Docker](/es/dapp-development/docker-setup/).

Si quieres acceder a nuestros contratos y scripts de muestra desde tu disco local o tienes la necesidad de instalar WAX-CDT en lugar de usar Docker, puedes usar esta guía para descargar y (de manera opcional) construir el código fuente de WAX-CDT.

<strong>Importante:</strong> Por el momento, los paquetes precompilados no están disponiblese. Al construir WAX-CDT desde el código fuente, el soporte <strong>no estará disponible</strong>.
{: .label .label-yellow }

## Qué incluye

- Una [librería de APIs C/C++](/es/api-reference/cdt_api) para comunicarte con la blockchain de WAX
- Ejemplos de contratos inteligentes para iniciar el desarrollo de tu dApp
- Herramientas para crear nuevas plantillas de contratos inteligentes 
- Guiones y herramientas de CMake para crear archivos WASM optimizados y de alto rendimiento
- Soporte para documentos ricardianos

WAX-CDT incluye variedad de comandos **eosio**, creados a partir de la infraestructura de front-end y herramientas de <a href="https://clang.llvm.org/" target="_blank">Clang</a>. Esta colección incluye varias herramientas para compilar y crear plantillas de contratos inteligentes. Si quieres ver una lista de dichas herramientas y parámetros, echa un vistazo a las [Opciones de WAX-CDT](/es/tools/cdt_options):

- Contratos de muestra y scripts **make** personalizables para generar automáticamente archivos WASM y ABI.
- Herramientas basadas en <a href="https://clang.llvm.org/" target="_blank">Clang</a>, incluyendo:
  - **eosio-cpp:** Compilador C++ WebAssembly 
  - **eosio-ld:** Vinculador WebAssembly
  - **eosio-abigen:** Generador de ABI C++ 

## Cómo funciona

Cuando estés listo para desplegar tu contrato inteligente en tu entorno de desarrollo local o en la mainnet de WAX, podrás usar el <a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">Kit de herramientas de desarrollo de contratos WAX</a> para convertir tu contrato en un archivo WebAssembly (WASM). También podrás usarlo para crear un archivo de Interfaz de Aplicación Binaria (Application Binary Interface o ABI) que incluya [contratos ricardianos](/es/tools/ricardian_contract) y [cláusulas ricardianas](/es/tools/ricardian_clause).

- **Archivos WebAssembly (WASM):** Un archivo WASM es un formato compacto y binario para tu contrato inteligente realizado en C++, optimizado para la velocidad y el rendimiento web. La Blockchain de WAX utiliza este archivo para ejecutar las acciones definidas en tu contrato. 

- **Archivos de Interfaz de Aplicación Binaria (ABI):** Un archivo ABI es una descripción JSON de las estructuras, tipos, acciones, tablas y otras definiciones del contrato inteligente. Esto permite a los desarrolladores y a las interfaces del cliente interpretar fácilmente la funcionalidad de su contrato. 


    ### Ejemplo de ABI
    Este ejemplo incluye un contrato ricardiano para la acción "hi" y una cláusula para el mismo.

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