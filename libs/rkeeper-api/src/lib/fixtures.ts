export const dish = {
  type: 'dish',
  modiweight: 0,
  price: 50000,
  modischeme: 0,
  active: 1,
  id: 9991000114,
  guid: '4b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'pr\u00f3ba ital',
};

export const inactiveDish = {
  type: 'dish',
  modiweight: 0,
  price: 50000,
  modischeme: 0,
  active: 0,
  id: 99911000114,
  guid: '44b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'pr\u00f3ba ital inactive',
};

export const dish2 = {
  type: 'dish',
  modiweight: 0,
  price: 60000,
  modischeme: 0,
  active: 1,
  id: 9991000115,
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
  id: 9991000115,
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
  id: 9991000116,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
};

export const badDish2 = {
  type: 'dish',
  modiweight: 0,
  modischeme: 0,
  active: 0,
  id: 99910001168,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
};

export const dishWithModifier = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 9991017197,
  active: 1,
  id: 9991008660,
  guid: '82874f87-92e4-4e0e-a122-d1be34b6f7b4',
  code: 1414,
  name: 'TA Kiot\u00F3i Szilv\u00E1s Kr\u00E9mk\u00E1v\u00E9',
};

export const dishWithSameModifier = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 9991017197,
  active: 1,
  id: 9991008661,
  guid: 'df2569d8-b809-41f2-8150-433adbbb0536',
  code: 1415,
  name: 'TA KM Kiot\u00F3i Szilv\u00E1s Kr\u00E9mk\u00E1v\u00E9',
};

export const modifier = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 1,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017194,
          name: 'Lakt\u00F3zmentes tej (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017193,
          name: 'Mandulaital (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 0,
          id: 9991017192,
          name: 'Sz\u00F3jaital (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017191,
          name: 'Zabital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 1,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 1011504,
      modi: [
        {
          maxOneDish: 1,
          price: 5000,
          weight: 1,
          active: 1,
          id: 9991011504,
          name: 'Pap\u00EDrpoh\u00E1r 2dl',
        },
        {
          maxOneDish: 1,
          price: 0,
          weight: 0,
          active: 1,
          id: 9991011517,
          name: 'Saj\u00E1t poh\u00E1r',
        },
      ],
      replaceDefModifier: 1,
      useUpLimit: 1,
      upLimit: 1,
      active: 1,
      id: 9991017199,
      name: '2dl pap\u00EDrpoh\u00E1r',
    },
  ],
  item: [],
  active: 1,
  id: 9991017197,
  code: 70,
};

export const unusedModifier = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 45000,
          weight: 0,
          active: 1,
          id: 9991040872,
          name: 'New York-i soml\u00F3i',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 1,
      id: 9991040868,
      name: 'Soml\u00F3i',
    },
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 45000,
          weight: 0,
          active: 1,
          id: 9991040859,
          name: 'Cappuccino',
        },
        {
          maxOneDish: 1,
          price: 45000,
          weight: 0,
          active: 1,
          id: 9991040858,
          name: 'KM Cappuccino',
        },
        {
          maxOneDish: 1,
          price: 45000,
          weight: 0,
          active: 1,
          id: 9991040864,
          name: 'TA Cappuccino',
        },
        {
          maxOneDish: 1,
          price: 45000,
          weight: 0,
          active: 1,
          id: 9991040865,
          name: 'TA KM Cappuccino',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 1,
      id: 9991040869,
      name: 'Cappuccino',
    },
  ],
  item: [],
  active: 1,
  id: 9991040867,
  code: 81,
};

export const rawData = {
  data: {
    dishes: [dish, dish2, duplicatedDish, badDish, badDish2],
  },
};

export const fullInactiveModifierGroup = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 0,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 0,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 1011504,
      modi: [
        {
          maxOneDish: 1,
          price: 5000,
          weight: 1,
          active: 0,
          id: 9991011504,
          name: 'Pap\u00EDrpoh\u00E1r 2dl',
        },
        {
          maxOneDish: 1,
          price: 0,
          weight: 0,
          active: 0,
          id: 9991011517,
          name: 'Saj\u00E1t poh\u00E1r',
        },
      ],
      replaceDefModifier: 1,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017199,
      name: '2dl pap\u00EDrpoh\u00E1r',
    },
  ],
  item: [],
  active: 1,
  id: 9991017197,
  code: 70,
};

export const partiallyInactiveModifierGroup = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 1,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 1,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 1011504,
      modi: [
        {
          maxOneDish: 1,
          price: 5000,
          weight: 1,
          active: 1,
          id: 9991011504,
          name: 'Pap\u00EDrpoh\u00E1r 2dl',
        },
        {
          maxOneDish: 1,
          price: 0,
          weight: 0,
          active: 1,
          id: 9991011517,
          name: 'Saj\u00E1t poh\u00E1r',
        },
      ],
      replaceDefModifier: 1,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017199,
      name: '2dl pap\u00EDrpoh\u00E1r',
    },
  ],
  item: [],
  active: 1,
  id: 9991017197,
  code: 70,
};

export const modifierGroupAllInactiveItems = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 0,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 0,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
  ],
  item: [],
  active: 1,
  id: 9991017197,
  code: 70,
};

export const modifierGroupPartiallyInactiveItems = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 1,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 0,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
  ],
  item: [],
  active: 1,
  id: 9991017197,
  code: 70,
};

export const inactiveModifierGroupActiveItems = {
  pid: 0,
  group: [
    {
      useDownLimit: 1,
      downLimit: 1,
      defaultModifier: 0,
      modi: [
        {
          maxOneDish: 1,
          price: 0,
          weight: 1,
          active: 1,
          id: 9991017196,
          name: 'Tej sima (90ml)',
        },
        {
          maxOneDish: 1,
          price: 10000,
          weight: 1,
          active: 1,
          id: 9991017195,
          name: 'K\u00F3kuszital (90ml)',
        },
      ],
      replaceDefModifier: 0,
      useUpLimit: 1,
      upLimit: 1,
      active: 0,
      id: 9991017198,
      name: 'Tejek 90ml',
    },
  ],
  item: [],
  active: 0,
  id: 9991017197,
  code: 70,
};

export const dishWithInactiveModifierGroups = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 9991017197,
  active: 1,
  id: 9991008660,
  guid: '82874f87-92e4-4e0e-a122-d1be34b6f7b4',
  code: 1414,
  name: 'TA Kiot\u00F3i Szilv\u00E1s Kr\u00E9mk\u00E1v\u00E9',
};

export const rawDataWithModifiers = {
  data: {
    dishes: [dish, dishWithModifier, dishWithSameModifier],
    modifiers: [modifier, unusedModifier],
  },
};

export const rawDataWithWaiterCaller = {
  data: {
    dishes: [
      {
        name: 'Picér hívás',
        active: 0,
        id: 1,
        variation: 2,
      },
    ],
    variations: [
      {
        id: 2,
        name: 'termék',
      },
    ],
  },
};
