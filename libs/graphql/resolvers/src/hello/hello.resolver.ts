import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {
  @Query('hello')
  async sayHello() {
    return 'hello, world';
  }
}
