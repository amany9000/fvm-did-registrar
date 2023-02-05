import { DidUriValidation } from './did-uri-validation';
import { BaseResponse } from './base-response';
import { RegistryContractInitialization } from './registry-contract-initialization';
import { ethers } from 'ethers';

/**
 * Update DID document on fvm chain.
 * @param did
 * @param didDocJson
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns transaction hash after updating DID Document on chain.
 */
export async function updateDidDoc(
    did: string,
    didDocJson: string,
    privateKey: string, // Todo: look for better way to address private key passing mechanism
    url?: string,
    contractAddress?: string
): Promise<BaseResponse> {
    try {
        let errorMessage: string;
        const didUriValidation: DidUriValidation = new DidUriValidation();
        const registryContractInitialization: RegistryContractInitialization =
            new RegistryContractInitialization();

        const didMethodCheck: Boolean = await didUriValidation.fvmDidMatch(did);
        const didWithTestnet: string = await didUriValidation.splitfvmDid(did);

        if (didMethodCheck) {
            const networkCheckWithUrl: any = await didUriValidation.networkMatch(
                did,
                url,
                contractAddress
            );

            const registry: ethers.Contract =
                await registryContractInitialization.instanceCreation(
                    privateKey,
                    networkCheckWithUrl.url,
                    networkCheckWithUrl.contractAddress
                );
            if (didDocJson && JSON.parse(didDocJson)) {
                if (
                    '@context' in JSON.parse(didDocJson) &&
                    'id' in JSON.parse(didDocJson) &&
                    'verificationMethod' in JSON.parse(didDocJson)
                ) {
                    const didAddress: string =
                        didWithTestnet === 'testnet'
                            ? did.split(':')[3]
                            : didWithTestnet;

                    // Calling smart contract with update DID document on fvm chain
                    let txnHash: any = await registry.functions
                        .updateDIDDoc(didAddress, didDocJson)
                        .then((resValue: any) => {
                            return resValue;
                        });

                    return BaseResponse.from(
                        txnHash,
                        'Update DID document successfully'
                    );
                } else {
                    errorMessage = `Invalid method-specific identifier has been entered!`;
                    throw new Error(errorMessage);
                }
            } else {
                errorMessage = `Invalid DID has been entered!`;
                throw new Error(errorMessage);
            }
        } else {
            errorMessage = `DID does not match!`;
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }
}
