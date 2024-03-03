---
layout: home
title: 欢迎来到WAX开发者门户
permalink: /cn/
---

<ContentColumns :ltr="false">
  <template v-slot:first>
    <div>
      <h1>WAX开发者门户</h1>
      <p>我们的使命是让像您这样的开发者能够在 WAX 链上构建开发创新应用程序、NFT 市场、去中心化金融 (DeFi) 工具和社区驱动的应用。凭借与用户友好的基础设施、强大的技术能力和蓬勃发展的社区，WAX 提供了可以将您的想法变为现实的完美环境。
      </p>
      <p>在 WAX 开发者门户中，您将找到丰富的资源来指导您的开发之旅。从详细的文档和教程到实际案例和最佳实践，我们都能满足您的需求。探索 WAX 链的核心概念，了解其共识机制，了解 WAXP 代币的作用，并探索如何使用 WAX 进行治理和互操作性功能。
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
    <h1>学习</h1>
    <p>加深您对区块链技术和 WAX 生态系统复杂性的理解。探索 WAX 共识背后的机制，探索智能合约开发，并掌握云钱包等基本工具。深入研究我们精选的资源，用深入的知识武装自己，自信地畅游区块链世界。</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/cn/learn/about-wax/" text="关于WAX" />
    <ContentLinkItem href="/cn/build/cloud-wallet/" text="我的云钱包t" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>建设</h1>
    <p>通过“构建”来激发您的开发技能。深入研究智能合约和 dApp 开发，利用强大的生态系统工具，并通过全面的指南、教程和资源释放您的创造力。构建区块链创新应用程序，并在 WAX 平台上将您的想法变为现实。</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/cn/build/dapp-development/docker-setup/" text="在Docker上运行WAX - 快速入门" />
    <ContentLinkItem href="/cn/build/dapp-development/wax-blockchain-setup/" text="本地运行WAX" />
    <ContentLinkItem href="/cn/build/dapp-development/wax-cdt/" text="了解WAX合约开发工具包（WAX-CDT）" />
    <ContentLinkItem href="/cn/build/dapp-development/setup-local-dapp-environment/" text="设置本地dApp环境" />
    <ContentLinkItem href="/cn/build/dapp-development/smart-contract-quickstart/" text="智能合约快速入门" />
    <ContentLinkItem href="/cn/build/api-reference/rpc_api" text="WAX RPC API" />
    <ContentLinkItem href="/cn/build/api-reference/cdt_api" text="WAX-CDT API" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>操作</h1>
    <p>通过操作来提升您的区块链知识。掌握管理区块链基础设施的技术，探索节点操作并提供必要的 API。增强安全性、优化性能并确保 WAX 生态系统的无缝运行。通过我们全面的指南和资源去使用区块链的力量。</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/cn/operate/wax-bp/" text="节点运营商基础知识" />
    <ContentLinkItem href="/cn/operate/atomic-assets/" text="设置并运行您自己的Atomic资产 API" />
    <ContentLinkItem href="/cn/operate/wax-infrastructure/" text="节点和API操作员的深入指南" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>创建</h1>
    <p>通过“创建”释放您的创造力。探索 WAX 链的工具和可能性，以推出数字资产、NFT 和社区支持的工具。了解创建工具、市场、DeFi 选项等，以丰富和吸引您的社区。在 WAX 平台上将您的愿景变为现实。
</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/cn/create/awesome-wax/" text="很棒的WAX" />
    <ContentLinkItem href="/cn/create/docs/" text="帮助我们改进文档!" />
  </template>
</ContentLinks>

<ChildTableOfContents :max="2" title="本节的更多内容" />