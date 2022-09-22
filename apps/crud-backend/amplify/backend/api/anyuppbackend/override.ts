import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
    
    resources.opensearch.OpenSearchDomain.elasticsearchClusterConfig = {
        ...resources.opensearch.OpenSearchDomain.elasticsearchClusterConfig,
        instanceCount: 3,
        instanceType: "t3.medium.elasticsearch",
        //dedicatedMasterEnabled: true,
        //dedicatedMasterCount: 3,
        //dedicatedMasterType: "t3.medium.elasticsearch",
    };

    resources.opensearch.OpenSearchDomain.advancedSecurityOptions = {
        enabled: true,
        internalUserDatabaseEnabled: true,
        masterUserOptions: {
            masterUserName: "anyupp_admin",
            //masterUserPassword: masterPassword.secretValue.toString(),
            //masterUserPassword: "It is already stored in SSM!",
            masterUserPassword: 'PeJh6wk6VdDnK-Lyc-YmkUu'
        },
    }

    resources.opensearch.OpenSearchDomain.domainEndpointOptions = {
        enforceHttps: true
    }

    resources.opensearch.OpenSearchDomain.nodeToNodeEncryptionOptions = {
        enabled: true
    }

    resources.opensearch.OpenSearchDomain.encryptionAtRestOptions = {
        enabled: true
    }

    // TODO: add logging later
}
