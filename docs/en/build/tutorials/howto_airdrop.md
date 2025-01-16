---
title: How to Airdrop Tokens and NFTs on WAX
order: 98
---

# How to Airdrop Tokens and NFTs on WAX Blockchain

## Introduction

Airdrops are a common way to distribute tokens or NFTs to multiple recipients on the WAX blockchain. This tutorial covers how to use the Disperse tool to efficiently manage token and NFT distributions at scale. The tool provides features for both fungible tokens (like WAX or TLM) and non-fungible tokens (NFTs).

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

## Best Practices

1. **Testing**: Always test with a small number of recipients first
2. **Rate Limiting**: The tool includes built-in delays, but monitor network conditions
3. **Asset Verification**: Double-check token/NFT availability before starting
4. **Transaction Monitoring**: Keep track of transaction IDs for verification
5. **Backup**: Save your distribution logs for future reference

## Error Handling

The tool includes several safety features:
- Validation of recipient accounts
- Verification of token/NFT availability
- Transaction retry logic
- Detailed error logging

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

## Technical Details

The tool uses:
- EOSJS for blockchain interactions
- PapaParse for CSV processing
- AtomicAssets API for NFT operations
- Automatic batching for optimization

## Troubleshooting

Common issues and solutions:
1. Insufficient resources (CPU/NET)
   - Solution: Stake more resources or use a powerup
2. Transaction timeout
   - Solution: Adjust network endpoint or retry
3. Invalid NFT IDs
   - Solution: Verify asset ownership and IDs

## Security Considerations

1. Never share your private key
2. Verify recipient addresses carefully
3. Monitor transaction logs
4. Keep your distribution records secure

## Support

For issues or questions:
1. Check the GitHub repository
2. Join the WAX Developer Discord
3. Review the WAX Developer Portal
