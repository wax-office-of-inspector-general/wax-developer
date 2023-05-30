import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/learn": [
    {
      text: "WAX Infrastructure Guides",
      collapsible: true,
      children: [
        "/learn/wax-infrastructure-guides/README.md",
        "/learn/wax-infrastructure-guides/README1.md",
        "/learn/wax-infrastructure-guides/README2.md",
        "/learn/wax-infrastructure-guides/README3.md",
        "/learn/wax-infrastructure-guides/README4.md",
        "/learn/wax-infrastructure-guides/README5.md",
        "/learn/wax-infrastructure-guides/README6.md",
        "/learn/wax-infrastructure-guides/README7.md",
        "/learn/wax-infrastructure-guides/README8.md",
      ],
    },
    {
      text: "Atomic Assets",
      collapsible: true,
      children: [
        "/learn/atomic-assets/README.md",
        "/learn/atomic-assets/README1.md",
      ],
    },
    {
      text: "WAX Cloud Wallet",
      collapsible: true,
      children: [
        "/learn/wax-cloud-wallet/README.md",
        "/learn/wax-cloud-wallet/README1.md",
        {
          text: "WaxJS Overview",
          collapsible: true,
          children: [
            "/learn/wax-cloud-wallet/README2.md",
            "/learn/wax-cloud-wallet/README3.md",
            "/learn/wax-cloud-wallet/README4.md",
          ],
        }
      ],
    },
    {
      text: "WAX Block Producer",
      collapsible: true,
      children: [
        "/learn/wax-block-producer/README.md",
        "/learn/wax-block-producer/README1.md",
      ],
    },
    {
      text: "dApp Development",
      collapsible: true,
      children: [
        "/learn/dapp-development/README.md",
        "/learn/dapp-development/README1.md",
        {
          text: "Docker Setup",
          collapsible: true,
          children: [
            "/learn/dapp-development/README2.md",
            "/learn/dapp-development/README3.md",
            "/learn/dapp-development/README4.md",
          ],
        },
        {
          text: "WAX Blockchain Setup",
          collapsible: true,
          children: [
            "/learn/dapp-development/README5.md",
            "/learn/dapp-development/README6.md",
          ],
        },
        {
          text: "Set Up a Local dApp Environment",
          collapsible: true,
          children: [
            "/learn/dapp-development/README7.md",
            "/learn/dapp-development/README8.md",
            "/learn/dapp-development/README9.md",
          ],
        },
        {
          text: "WAX Contract Development Toolkit",
          collapsible: true,
          children: [
            "/learn/dapp-development/README10.md",
            "/learn/dapp-development/README11.md",
            "/learn/dapp-development/README12.md",
          ],
        },
        {
          text: "Smart Contract Quickstart",
          collapsible: true,
          children: [
            "/learn/dapp-development/README13.md",
            "/learn/dapp-development/README14.md",
            "/learn/dapp-development/README15.md",
            "/learn/dapp-development/README16.md",
            "/learn/dapp-development/README17.md",
          ],
        },
        {
          text: "Deploy Your dApp on WAX",
          collapsible: true,
          children: [
            "/learn/dapp-development/README18.md",
            "/learn/dapp-development/README19.md",
          ],
        }
      ],
    },
    {
      text: "WAX API Reference",
      collapsible: true,
      children: [
        "/learn/wax-reference/README.md",
        "/learn/wax-reference/README1.md",
        {
          text: "dfuse for WAX dApps",
          collapsible: true,
          children: [
            "/learn/wax-reference/README3.md",
          ],
        },
      ],
    },
    {
      text: "Tools & Topics",
      collapsible: true,
      children: [
        "/learn/tools-topic/README.md",
        "/learn/tools-topic/README1.md",
        "/learn/tools-topic/README2.md",
        "/learn/tools-topic/README3.md",
        "/learn/tools-topic/README4.md",
      ],
    },
    {
      text: "Tutorials",
      collapsible: true,
      children: [
        {
          text: "How-To AtomicAssets",
          collapsible: true,
          children: [
            "/learn/tutorials/README1.md",
            "/learn/tutorials/README2.md",
            "/learn/tutorials/README3.md",
            "/learn/tutorials/README4.md",
            "/learn/tutorials/README5.md",
            "/learn/tutorials/README6.md",
          ],
        },
        {
          text: "Create a WAX RNG Smart Contract",
          collapsible: true,
          children: [
            "/learn/tutorials/README1.md",
            "/learn/tutorials/README2.md",
            "/learn/tutorials/README3.md",
            "/learn/tutorials/README4.md",
            "/learn/tutorials/README5.md",
            "/learn/tutorials/README6.md",
          ],
        },
        {
          text: "How-To SimpleAssets",
          collapsible: true,
          link: '/learn/tutorials/README1.md',
          children: [
            "/learn/tutorials/README1.md",
            "/learn/tutorials/README2.md",
            "/learn/tutorials/README3.md",
            "/learn/tutorials/README4.md",
            "/learn/tutorials/README5.md",
            "/learn/tutorials/README6.md",
          ],
        },
        {
          text: "Uninstall WAX",
          children: ["/learn/tutorials/README6.md"],
        },
        {
          text: "Uninstall WAX-CDT",
          children: ["/learn/tutorials/README6.md"],
        },
        {
          text: "Custom Permissions",
          children: ["/learn/tutorials/README6.md"],
        },
      ],
    },
    {
      text: "Release Notes",
      collapsible: true,
      children: [
        "/learn/release-notes/README.md",
        "/learn/release-notes/README1.md",
        "/learn/release-notes/README2.md",
      ],
    },
    {
      text: "Troubleshooting",
      collapsible: false,
      children: ["/learn/wax-infrastructure-guides/README.md"],
    },
  ],
});
