---
title: Welcome to WAX Developer Portal
breadcrumb: Start
order: 1
---

<ContentColumns :ltr="false">
  <template v-slot:first>
    <div>
      <h1>WAX Developer Portal</h1>
      <p>The Worldwide Asset eXchange™ (WAX) is a purpose-built blockchain and protocol token designed to make e-commerce transactions faster, easier, and safer for everyone. WAX makes building and deploying high-performance, secure dApps easy. Here you’ll find Quickstarts, sample code, API reference guides, and all of the developer tools you need to set up a local WAX environment and write your smart contracts.</p>
    </div>
  </template>
  <template v-slot:second>
    <div>
      <br>
      <br>
      <br>
      <ImageWithAspect src="/assets/images/front-cube.png" />
    </div>
  </template>
</ContentColumns>

<ContentLinks>
  <template v-slot:content>
    <h1>Start here</h1>
    <p>Discover the features of WAX Blockhain technology and its ecosystem.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="./wax-cloud-wallet" text="Learn about MyCloudWallet" />
    <ContentLinkItem href="#" text="Complete our Docker Quickstart" />
    <ContentLinkItem href="#" text="Download WAX Blockchain source code and samples using the WAX Blockchain Setup guide" />
    <ContentLinkItem href="#" text="Learn about the WAX Contract Development Toolkit WAX-CDT" />
    <ContentLinkItem href="#" text="Set Up a Local dApp Environment" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>Build a dApp</h1>
    <p>Once you’ve set up your development environment, these tutorials can help you launch the next great dApp on WAX</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="./wax-cloud-wallet" text="Learn about MyCloudWallet" />
    <ContentLinkItem href="#" text="Complete our Docker Quickstart" />
    <ContentLinkItem href="#" text="Download WAX Blockchain source code and samples using the WAX Blockchain Setup guide" />
    <ContentLinkItem href="#" text="Learn about the WAX Contract Development Toolkit WAX-CDT" />
    <ContentLinkItem href="#" text="Set Up a Local dApp Environment" />
  </template>
</ContentLinks>

<ChildTableOfContents :max="2" title="More inside this section" />

