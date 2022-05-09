import { pick } from 'ramda';
import { delay, switchMap, tap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { chainFixture } from '@bgap/shared/fixtures';
import { filterNullish } from '@bgap/shared/utils';

const TEST_NAME = 'CHAIN_';
const DYNAMODB_OPERATION_DELAY = 3000;
const JEST_TIMEOUT = 60000;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

const chainId1 = 'int_test_chain_id_1';
const chainId2 = 'int_test_chain_id_2';
const chainId3 = 'int_test_chain_id_3';

const oldStyleChainFixture = {
  ...chainFixture.chainBase,
  id: chainId1,
  style: {
    ...chainFixture.chainBase.style,
    colors: pick(
      [
        'backgroundDark',
        'backgroundLight',
        'borderDark',
        'borderLight',
        'disabled',
        'highlight',
        'indicator',
        'textDark',
        'textLight',
      ],
      chainFixture.chainBase.style.colors,
    ),
  },
};

const mixedStyleChainFixture = {
  ...chainFixture.chainBase,
  id: chainId2,
};

const newStyleChainFixture = {
  ...chainFixture.chainBase,
  id: chainId3,
  style: {
    ...chainFixture.chainBase.style,
    colors: pick(
      ['button', 'buttonText', 'icon', 'highlight'],
      chainFixture.chainBase.style.colors,
    ),
  },
};

describe('Chain mutations', () => {
  let crudSdk: CrudApi.CrudSdk;
  crudSdk = CrudApi.getCrudSdkForIAM(accessKeyId, secretAccessKey);

  const cleanup = (id: string) =>
    crudSdk.DeleteChain({
      input: {
        id,
      },
    });

  const creationTestLogic = (id: string, input: CrudApi.CreateChainInput) =>
    cleanup(id).pipe(
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(() =>
        crudSdk.CreateChain({
          input,
        }),
      ),
      filterNullish(),
      tap(response => {
        expect(response).toMatchSnapshot({
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      }),
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(() => cleanup(id)),
    );

  const updateTestLogic = (id: string, input: CrudApi.CreateChainInput) =>
    cleanup(id).pipe(
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(() =>
        crudSdk.CreateChain({
          input,
        }),
      ),
      delay(DYNAMODB_OPERATION_DELAY),
      filterNullish(),
      switchMap(response =>
        crudSdk.UpdateChain({
          input: {
            // ...input,
            id: response.id,
            email: 'testuser+mod@anyupp.com',
            name: `${chainFixture.chainBase.name} modded`,
          },
        }),
      ),
      filterNullish(),
      tap(moddedChainData => {
        expect(moddedChainData).toMatchSnapshot({
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      }),
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(() => cleanup(id)),
    );

  it(
    'should create chain from an old styled fixture',
    done => {
      creationTestLogic(
        oldStyleChainFixture.id,
        oldStyleChainFixture,
      ).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );

  it(
    'should create chain from a mixed styled fixture',
    done => {
      creationTestLogic(
        mixedStyleChainFixture.id,
        mixedStyleChainFixture,
      ).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );

  it(
    'should create chain from a new styled fixture',
    done => {
      creationTestLogic(
        newStyleChainFixture.id,
        newStyleChainFixture,
      ).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );

  it(
    'should update chain from an old styled fixture',
    done => {
      updateTestLogic(oldStyleChainFixture.id, oldStyleChainFixture).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );

  it(
    'should update chain from a mixed styled fixture',
    done => {
      updateTestLogic(
        mixedStyleChainFixture.id,
        mixedStyleChainFixture,
      ).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );

  it(
    'should update chain from a new styled fixture',
    done => {
      updateTestLogic(newStyleChainFixture.id, newStyleChainFixture).subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    },
    JEST_TIMEOUT,
  );
});
