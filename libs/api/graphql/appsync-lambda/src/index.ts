import x = require('source-map-support');
x.install();
import 'reflect-metadata';

// dont't remove the line break, the above imports must be the first ones

export const handler: Handler = (
  event: any,
  _context: Context,
  callback
): any => {
  console.log('Registering resolvers...');
  callback(null, {});
};
