---
title: About WAX
order: 1
index: false
author: false
homefeatures: Tell me more
---

<ContentColumns :ltr="false">
  <template v-slot:first>
    <div>
      <h1>Welcome to WAX</h1>
      <p>The Worldwide Asset eXchange™ (WAX) is a purpose-built blockchain and protocol token designed to make e-commerce transactions faster, easier, and safer for everyone. WAX makes building and deploying high-performance, secure dApps easy. Here you’ll find Quickstarts, sample code, API reference guides, and all of the developer tools you need to set up a local WAX environment and write your smart contracts.</p>
    </div>
  </template>

  <template v-slot:second>
    <ImageWithAspect src="/assets/images/front-cube.png" />
  </template>
</ContentColumns>

<ContentLinks>
  <template v-slot:content>
    <h1>Awesome Headline</h1>
    <p>Lorem Ipsum dolor sit amet.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="#" text="Learn about Wax Cloud Wallet" />
    <ContentLinkItem href="#" text="Complete our Docker Quickstart" />
    <ContentLinkItem href="#" text="Download WAX Blockchain source code and samples using the WAX Blockchain Setup guide" />
    <ContentLinkItem href="#" text="Learn about the WAX Contract Development Toolkit WAX-CDT" />
    <ContentLinkItem href="#" text="Set Up a Local dApp Environment" />
  </template>
</ContentLinks>

Custom Components

<GridCatalog base='/learn/' title="Learn" :level="1"></GridCatalog>

