// import * as CrudApi from '@bgap/crud-gql/api';
// import { testAdminEmail, testAdminUserPassword } from '@bgap/shared/fixtures';
// import { Auth } from '@aws-amplify/auth';
// import { from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

// describe('CRUD ownership tests', () => {
//   const authSdk = CrudApi.getCrudSdkForUserPool();
//   const publicSdk = CrudApi.getCrudSdkPublic();
//   const adminUserId = testAdminEmail.split('@')[0];

//   it('It should not access own data of AdminUser without signin', done => {
//     publicSdk.GetAdminUser({ id: adminUserId }).subscribe({
//       next: x => console.warn(x),
//       error(e) {
//         expect(e).toMatchSnapshot();
//         done();
//       },
//     });
//   }, 15000);

//   it('It should not access own data of AdminUser with signin', done => {
//     from(Auth.signIn(testAdminEmail, testAdminUserPassword))
//       .pipe(switchMap(() => authSdk.GetAdminUser({ id: adminUserId })))
//       .subscribe({
//         next: x => console.warn(x),
//         error(e) {
//           expect(e).toMatchSnapshot();
//           done();
//         },
//       });
//   }, 15000);
// });
