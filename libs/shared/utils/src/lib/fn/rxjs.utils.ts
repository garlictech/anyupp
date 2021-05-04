import { tap } from 'rxjs/operators';

export const pipeDebug = <T>(tag: string) => {
  return tap<T>({
    next(value) {
      console.log(`[${tag}: Next]`, JSON.stringify(value, undefined, 2));
    },
    error(error) {
      console.log(`[${tag}: Error]`, JSON.stringify(error, undefined, 2));
    },
    complete() {
      console.log(`[${tag}]: Complete`);
    },
  });
};
