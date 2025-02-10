---
title: ServerSide Verification
order: 100
---

# Using NKCSS.Antelope.Verify to validate clientside logins on the backend

Both [MyCloudWallet](https://mycloudwallet.com) and [Anchor](https://github.com/greymass/anchor) offer an option to, as part of the standard identity proof request, also sign a proof that you can individually validate on the backend. These proofs can be validated using ECDSA and are ideal for Unity/.NET backend applications and are invisible to the user, not requiring any additional actions compared to the normal client-side-only workflow.

## How to enable this for MyCloudWallet

You can look [here](https://github.com/worldwide-asset-exchange/waxjs#21-login-combining-proof-system) to see how you can make MyCloudWallet provide the additional proof, or check the [NKCSS.Antelope.Verify](https://github.com/NKCSS/NKCSS.Antelope.Verify/) for an example implementation.

## How to enable this for Anchor

There isn't any documentation available that I could find, but it boils down to a `proof` property being available in the login response, which can be used to validte on the backend. It's signed with a 60-second expiration to prevent replay attacks. You can see [an implementation example in the NKCSS.Antelope.Verify repository](https://github.com/NKCSS/NKCSS.Antelope.Verify/blob/97eac764b52bb185ab4a762ebe00afc1fb4c146b/VerificationExample/wwwroot/js/site.js#L99).