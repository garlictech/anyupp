import { Injectable } from '@angular/core';
import { DataStore } from '@aws-amplify/datastore';

@Injectable({
  providedIn: 'root',
})
export class AmplifyService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async snapshotChanges<T>(
    model: any,
    param: any,
    callback: any,
  ): Promise<void> {
    const data = await (param
      ? DataStore.query(model, param)
      : DataStore.query(model));

    if (Array.isArray(data)) {
      (<T[]>data).forEach((d: T) => {
        callback(<T>d);
      });
    } else {
      callback(<T>data);
    }

    (param ? DataStore.observe(model, param) : DataStore.observe(model))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((msg: any) => {
        callback(<T>msg.element);
      });
  }

  public async create(model: any, data: any) {
    await DataStore.save(
      new model(data)
    );
  }

  public async update(model: any, id: string, callback: any) {
    const original = await DataStore.query(model, id);

    if (original) {
      await DataStore.save(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model.copyOf(original, callback),
      );
    }
  }
}
