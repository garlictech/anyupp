import { tap } from 'rxjs/operators';

export const resultTap = <T>(typename: string, id: string) =>
  tap<T>({
    next(resultObj) {
      if (resultObj) {
        console.log(`### ${typename} deleted with id: ${id}`);
      }
    },
    error(err) {
      console.error(
        `### Error during ${typename} delete with id: ${id}`,
        err.message,
      );
    },
  });
