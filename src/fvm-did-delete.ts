import { DidUriValidation } from './did-uri-validation';
import { BaseResponse } from './base-response';
import { RegistryContractInitialization } from './registry-contract-initialization';
import { ethers } from 'ethers';

/**
 * Delete DID Document.
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Return transaction hash after deleting DID Document on chain.
 */
export async function deleteDidDoc(
    did: string,
    privateKey: string,
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
            const didAddress: string =
                didWithTestnet === 'testnet' ? did.split(':')[3] : didWithTestnet;

            let txnHash: any = await registry.functions
                .deleteDIDDoc(didAddress)
                .then((resValue: any) => {
                    return resValue;
                });

            return BaseResponse.from(txnHash, 'Delete DID document successfully');
        } else {
            errorMessage = `DID does not match!`;
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }
}
