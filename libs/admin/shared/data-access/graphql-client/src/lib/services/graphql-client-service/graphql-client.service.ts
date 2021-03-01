import { NGXLogger } from 'ngx-logger';

import { Injectable } from '@angular/core';
import { AWS_CONFIG } from '@bgap/admin/shared/config';
import {
  GraphqlApiClient,
  GraphqlApiFp,
} from '@bgap/shared/graphql/api-client';

@Injectable({
  providedIn: 'root',
})
export class GraphqlClientService {
  public readonly adminClient: GraphqlApiClient;

  constructor(log: NGXLogger) {
    this.adminClient = GraphqlApiFp.createPublicClient(AWS_CONFIG, log, true);
  }
}
