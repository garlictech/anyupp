import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { GraphqlResolversModule } from '@bgap/graphql/resolvers';

const SCHEMA_ROOT = join(process.cwd(), 'libs/graphql/schema/src');

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [`${SCHEMA_ROOT}/schema/**/*.graphql`],
      definitions: {
        path: `${SCHEMA_ROOT}/lib/api.ts`,
        emitTypenameField: true,
        outputAs: 'class'
      },
      installSubscriptionHandlers: true
    }),
    GraphqlResolversModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
