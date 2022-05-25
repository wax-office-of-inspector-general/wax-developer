---
title: How-To AtomicAssets
nav_order: 30
layout: default
parent: Tutorials
has_children: true
has_toc: true
lang-ref: How-To AtomicAssets
lang: en
---

AtomicAssets is the smart contract created by Pink Network, an important validator guild for WAX Blockchain, to manage the NFT standard of the same name and whose repository can be consulted on GitHub: [AtomicAssets](https://github.com/pinknetworkx/atomicassets-contract).

It is currently the most widely accepted and used NFT standard in WAX environments, both for creating NFTs for art collections and for the world of videogames or any other application.

During the next entries of this tutorial we will explore its features and how we can make use of them, both from a smart contract and from JavaScript based applications.

Among the most important features to highlight we can mention:

- The cost of RAM is assumed by whoever mints the NFT and not by whoever owns it.
- Data is serialised to achieve significant RAM savings.
- It uses a template system which, together with serialisation, allows RAM consumption to be reduced.
- It has its own open source API that allows for faster access to NFT data without having to read the smart contract tables.
