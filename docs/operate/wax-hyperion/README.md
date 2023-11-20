---
title: WAX Hyperion Guides
order: 3
---

# Guides for Hyperion Operators on WAX

Part of the utility of a highly performing blockchain is the ability to query historical transactions of the network. Although by their very nature all blockchains have every transaction recorded in the chain, this record is typically not easily searchable or queryable.

WAX Software is no different in this regard and originally had a provision for queryable history called the history_plugin or V1 History. The history plugin was actually deprecated in 2018 which prompted alternatives to be built by the community.

The most popular Full History alternatives being EOS Canada’s  [Dfuse](https://github.com/dfuse-io)  now called  [Streaming Fast](https://www.streamingfast.io/)  and  [Hyperion](https://github.com/eosrio/hyperion-history-api)  from  [EOS RIO](https://eosrio.io/). A new option for a Lite History solution has also just been released by cc32d9 called  [Memento](https://github.com/cc32d9/eosio_memento)  that certainly looks interesting.

EOSphere have extensive production experience with providing Full History services using Hyperion on the WAX Mainnet and Testnet as well as other neworks. This quide will share this experience with you, broken into a series starting with an introduction to the software components and hardware requirements of a production ready WAX Hyperion Full History Solution.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/1*ATnQKunF5rVtPEsL-sP0JA.png)

_This article series has been updated to reflect the current Hyperion deployment in September 2023._

<ChildTableOfContents :max="2" title="More inside this section" />