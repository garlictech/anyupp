import { tap } from 'rxjs/operators';

export const pipeDebug = <T>(tag: string) => {
  return tap<T>({
    next(value) {
      console.debug(`[${tag}: Next]`, JSON.stringify(value, undefined, 2));
    },
    error(error) {
      console.debug(`[${tag}: Error]`, JSON.stringify(error, undefined, 2));
    },
    complete() {
      console.debug(`[${tag}]: Complete`);
    },
  });
};
