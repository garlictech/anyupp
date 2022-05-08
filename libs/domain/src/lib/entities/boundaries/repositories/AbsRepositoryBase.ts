export abstract class AbsRepositoryBase<ENTITY, ENTITY_UPDATE_INPUT> {
  abstract getById(id: string): Promise<ENTITY | null>;

  abstract update(update: ENTITY_UPDATE_INPUT): Promise<ENTITY | null>;
}
