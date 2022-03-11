import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { Observable } from 'rxjs';

export const oeTryCatch = <TYPE>(x: Observable<TYPE>) =>
  OE.tryCatch(x) as OE.ObservableEither<string, TYPE>;
