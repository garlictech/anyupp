import { tap } from 'rxjs/operators';

export const resultTap = <T>(typename: string, id: string) =>
  tap<T>({
    // next(resultObj) {
    //   // if (resultObj) {
    //   //   console.log(`### ${typename} with id: ${id}`);
    //   // }
    // },
    error(err) {
      console.error(
        `### Error during ${typename} with id: ${id}`,
        JSON.stringify(err, null, 2),
      );
    },
  });
