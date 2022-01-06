export type RequiredId<T> = Omit<T, 'id'> & { id: string };

export type UpsertResponse<T> = { data: T; type: string };
