export const dish = {
  type: 'dish',
  modiweight: 0,
  price: 50000,
  modischeme: 0,
  active: 0,
  id: 1000114,
  guid: '4b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba ital',
};

export const dish2 = {
  type: 'dish',
  modiweight: 0,
  price: 60000,
  modischeme: 0,
  active: 0,
  id: 1000115,
  guid: '5b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba kaja',
};

export const duplicatedDish = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 0,
  active: 0,
  id: 1000115,
  guid: '5b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba kaja duplicated',
};

export const badDish = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 0,
  active: 0,
  id: 1000116,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
};

export const badDish2 = {
  type: 'dish',
  modiweight: 0,
  modischeme: 0,
  active: 0,
  id: 10001168,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
};

export const rawData = {
  data: {
    dishes: [dish, dish2, duplicatedDish, badDish, badDish2],
  },
};
