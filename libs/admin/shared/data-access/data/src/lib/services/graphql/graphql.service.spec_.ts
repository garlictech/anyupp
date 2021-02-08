import { TestBed } from '@angular/core/testing';

import { GraphQLService } from './graphql.service';

xdescribe('OrderService', (): void => {
  let service: GraphQLService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphQLService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
