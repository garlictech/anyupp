import { Module } from '@nestjs/common';
import { getSecrets } from './get-secrets';

// TODO: won't be used
const sharedSecretsProvider = {
  provide: 'SHARED_SECRETS',
  useFactory: async () => {
    const secrets = await getSecrets();
    return secrets;
  },
};

@Module({
  controllers: [],
  providers: [sharedSecretsProvider],
  exports: [sharedSecretsProvider],
})
export class SharedSecretsModule {}
