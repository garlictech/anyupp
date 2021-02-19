export function throwIfAlreadyLoaded(
  parentModule: unknown,
  moduleName: string,
): void {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import Core modules in the AppModule only.`,
    );
  }
}
