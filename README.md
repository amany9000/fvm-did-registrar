# fvm DID Method

The fvm DID method library uses Ethereum based addresses as fully functional DID’s or Decentralized identifiers, on the fvm network. The following allows one to create a key Pair based and facilitates its storage on the registry smart contract, deployed on fvm chain.
Third party users can use this to create fvm DID identities. It allows the controller to perform actions like resolve, update and delete by encapsulating fvmDID registry and fvmDID resolver.
The DID identifier allows the controller to resolve DID document for usage in different scenarios.
 
### Example of fvm DID document resolved using fvmDIDResolver:

```json
{
	"@context": "https://w3id.org/did/v1",
	"id": "did:fvm:0x794b781493AeD65b9ceBD680716fec257e118993",
	"verificationMethod": [{
		"id": "did:fvm:0x794b781493AeD65b9ceBD680716fec257e118993",
		"type": "EcdsaSecp256k1VerificationKey2019",
		"controller": ["did:fvm:0x794b781493AeD65b9ceBD680716fec257e118993"],
		"publicKeyBase58": "7Lnm1ZnseKDkH1baAb1opREfAU4MPY7zCdUDSrWSm9NxNTQmy4neU9brFUYnEcyy7CwFKjD11ikyP9J8cf6zEaAKrEzzp"
	}]
}
```

# DID Method or DID schema

The DID method is a specific implementation of a DID scheme that will be identified by method name. For this case the method name is “fvm”, and the identifier is an Ethereum address.

## The DID for fvm looks like:

### On fvm mainnet
```
did:fvm:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb
```

### On fvm testnet
```
did:fvm:testnet:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb
```

## DID On-Chain

Every DID on chain has the same structure, defined as:

```js 
struct PolyDID{
        address controller;
        uint created;
        uint updated;
        string doc;
    }
```
Where,
- controller : the address of the person who creates and manages the DID
- created : holds the timestamp of the block when DID was created
- updated : initially holds the timestamp of when the DID was created, but is updated if the controller updates the DID on chain, and
- doc : holds the entire DID document in form of string.

# DID Operations

## Create

Creating a DID refers to generation of a DID uri, based on either a newly generated wallet or user's existing wallet. Note that the wallet should hold TFIL tokens.

Can be invoked using 2 methods

Method 1: With user's personal privateKey and network type(mainnet/testnet)

```js
import { createDID } from "fvm-did-registrar";
const txHash = await createDID(network, privateKey);
```

Method 2: With only network type(mainnet/testnet)

```js
import { createDID } from "fvm-did-registrar";
const txHash = await createDID(network);
```
The function returns, address, publicKey (base58 format), privateKey and DID uri.

## Register

Register of DID is done by logging the transaction on the fvm-register smart contract, by invoking

```js
import { registerDID } from "fvm-did-registrar";
const txHash = await registerDID(did, privateKey, url?, contractAddress?);
```
The function returns a txhash and DID uri on successful execution.

## Update

The DID controller requests for the update functionality, if the controller wishes to edit the did doc store on the ledger using :

```js
import { updateDidDoc } from "fvm-did-registrar";
const txHash = await updateDidDoc(did, didDoc, privateKey, url?, contractAddress?);
```

## Delete

To remove the instance of DID from the ledger the above function is used as follows :

```js
import { deleteDidDoc } from "fvm-did-registrar";
const txHash = await deleteDidDoc(did, privateKey, url?, contractAddress?);
```
