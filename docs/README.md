---
title: Welcome to WAX Developer Portal
breadcrumb: Start
order: 1
---

<ContentColumns :ltr="false">
  <template v-slot:first>
    <div>
      <h1>WAX Developer Portal</h1>
      <p>Our mission is to empower developers like you to build innovative applications, NFT marketplaces, decentralized finance (DeFi) tools, and community-driven experiences on the WAX blockchain. With user-friendly infrastructure, robust technical capabilities, and a thriving community, WAX provides the perfect environment to turn your ideas into reality.
      </p>
      <p>
      Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey. From detailed documentation and tutorials to practical examples and best practices, we've got you covered. Explore the core concepts of the WAX blockchain, learn about its consensus mechanism, understand the role of the WAXP token, and discover how to leverage WAX governance and interoperability features.
      </p>
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
    <h1>LEARN</h1>
    <p>Expand your understanding of blockchain technology and the intricacies of the WAX ecosystem. Discover the mechanics behind the WAX consensus, explore smart contract development, and master essential tools like MyCloudWallet. Dive into our curated resources and empower yourself with in-depth knowledge to navigate the world of blockchain with confidence.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/learn/about-wax/" text="About WAX" />
    <ContentLinkItem href="/learn/my-cloud-wallet/" text="My Cloud Wallet" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>BUILD</h1>
    <p>Ignite your development skills with the Build section. Dive into Smart Contract and dApp development, leverage powerful ecosystem tools, and unleash your creativity with comprehensive guides, tutorials, and resources. Build innovative blockchain applications and bring your ideas to life on the WAX platform.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/build/dapp-development/docker-setup/" text="Run WAX on Docker - Quickstart" />
    <ContentLinkItem href="/build/dapp-development/wax-blockchain-setup/" text="Run WAX natively" />
    <ContentLinkItem href="/build/dapp-development/wax-cdt/" text="Learn about the WAX Contract Development Toolkit (WAX-CDT)" />
    <ContentLinkItem href="/build/dapp-development/setup-local-dapp-environment/" text="Set Up a Local dApp Environment" />
    <ContentLinkItem href="/build/dapp-development/smart-contract-quickstart/" text="Smart Contract Quickstart" />
    <ContentLinkItem href="/build/api-reference/rpc_api" text="WAX RPC API" />
    <ContentLinkItem href="/build/api-reference/cdt_api" text="WAX-CDT API" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>OPERATE</h1>
    <p>Elevate your blockchain operations with the Operate section. Master the art of managing blockchain infrastructure, explore node operation, and provision essential APIs. Enhance security, optimize performance, and ensure the seamless operation of your WAX ecosystem. Harness the power of operating blockchain with our comprehensive guides and resources.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/operate/wax-bp/" text="Node Operator Basics" />
    <ContentLinkItem href="/operate/atomic-assets/" text="Setup and Run your own Atomic Assets API" />
    <ContentLinkItem href="/operate/wax-infrastructure/" text="In-Depth Guides for Node and API operators" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>CREATE</h1>
    <p>Unleash your creativity in the Create section. Discover the tools and possibilities of the WAX blockchain to launch digital assets, NFTs, and community-powered tools. Learn about creation tools, marketplaces, DeFi options, and more to enrich and engage your community. Bring your vision to life on the WAX platform.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/create/awesome-wax/" text="Awesome WAX" />
    <ContentLinkItem href="/create/docs/" text="Help us improve the docs!" />
  </template>
</ContentLinks>

<ChildTableOfContents :max="2" title="More inside this section" />

