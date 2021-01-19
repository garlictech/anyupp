import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGraphqlResolversModule } from '@bgap/api/graphql/resolvers';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
    }),
    ApiGraphqlResolversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
