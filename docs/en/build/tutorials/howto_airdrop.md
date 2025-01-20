---
title: How to Airdrop Tokens and NFTs on WAX
order: 98
---

# How to Airdrop Tokens and NFTs on WAX Blockchain

## Introduction

Airdrops are a popular way to share tokens or NFTs with a large audience, often used for promotions, rewards, or giveaways. They help projects gain attention, engage their community, or show appreciation to supporters. On the WAX blockchain, this process is made easy with Disperse. It works with both fungible tokens like WAX or TLM and non-fungible tokens (NFTs), allowing you to manage large-scale distributions quickly and efficiently.

## Key Features

### Token Distribution Features
- Batch processing of token transfers from CSV files
- Configurable token parameters (symbol, decimals)
- Transaction success tracking with Transaction IDs
- Built-in rate limiting protection
- Automatic transaction batching

### NFT Distribution Features
- Two transfer modes:
  - Direct NFT transfers (specific asset IDs)
  - Template-based transfers (distribute NFTs from a template)
- Automatic batching of up to 15 NFTs per transaction
- Atomic Assets API integration
- Recipient-based transfer optimization

## Prerequisites

Before starting, ensure you have:
- Bun runtime installed
- An active WAX account with sufficient tokens/NFTs for distribution
- The private key for your WAX account with transfer permissions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/disperse.git
cd disperse
```

2. Install the required dependencies:
```bash
bun install eosjs papaparse
```

## Token Airdrop Configuration

Create or modify `config.js` with your account details:

```javascript
export const config = {
  rpcApi: "https://wax.qaraqol.com",
  privateKey: "",  // Your private key
  senderName: "",  // Your WAX account
  contractName: "alien.worlds", // Use eosio.token for WAX tokens
  tokenName: "TLM",
  tokenPrecision: 4, // 8 for WAX, 4 for TLM
  memo: "Disperse",
};
```

### Preparing Token Distribution CSV

Create a CSV file (e.g., `receivers.csv`) with recipient accounts and amounts:

```csv
receiverName,amount
account1,100
account2,50
account3,75
```

## NFT Airdrop Configuration

For NFT distributions, use this configuration:

```javascript
export const config = {
  rpcApi: "https://wax.greymass.com",
  atomicApi: "https://atomic-wax.qaraqol.com",
  privateKey: "",
  senderName: "",
  contractName: "atomicassets",
  memo: "",
  useTemplateMode: false,  // true for template-based distribution
  collection_name: "", 	// Required for template mode
  template_id: "",    	// Required for template mode
};
```

### Preparing NFT Distribution CSV

For direct NFT transfers (`useTemplateMode: false`):
```csv
receiverName,asset_id
account1,1099554645488
account2,1099583135618
```

For template-based transfers (`useTemplateMode: true`):
```csv
receiverName,amount
account1,5
account2,3
```

## Running the Airdrop

Execute the distribution script:
```bash
bun run app.js
```

The script will:
1. Load and validate the CSV data
2. Group transfers for optimization
3. Process transactions with built-in delays
4. Log transaction IDs and status

## Advanced Usage

### Custom Token Configuration
You can modify token parameters for different tokens:
- WAX: precision 8, contract "eosio.token"
- TLM: precision 4, contract "alien.worlds"

### NFT Template Distribution
When using template mode:
1. Set `useTemplateMode: true`
2. Specify collection_name and template_id
3. Ensure sufficient template assets are available

