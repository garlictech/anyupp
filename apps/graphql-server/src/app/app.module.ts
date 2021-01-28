import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ApiGraphqlResolversModule } from '@bgap/api/graphql/resolvers';

const SCHEMA_ROOT = join(process.cwd(), 'libs/api/graphql/schema/src');

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [`${SCHEMA_ROOT}/schema/**/*.graphql`],
      installSubscriptionHandlers: true,
      // https://docs.nestjs.com/graphql/subscriptions#customize-subscriptions-server
      // subscriptions: {
      //   keepAlive: 5000,
      // },
    }),
    ApiGraphqlResolversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
