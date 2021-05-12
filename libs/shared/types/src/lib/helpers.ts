export type RequiredId<T> = Omit<T, 'id'> & { id: string };
