import * as Joi from 'joi';
import { validateSchema } from './validate';
type Image = {
  url: string;
  width: number;
  height: number;
};
const imageSchema: Joi.SchemaMap = {
  url: Joi.string().uri().required(),
  width: Joi.number().integer().positive(),
  height: Joi.number().integer().positive(),
};
const image: Image = {
  url: 'http://imgURL.hu',
  width: 100,
  height: 100,
};
const imageInvalid = {
  width: 100,
  height: 100,
};
const { validate: validateImage, isType: isImage } = validateSchema<Image>(
  imageSchema,
);

describe('JOI validaton test', () => {
  it('should be valid', async () => {
    expect(isImage(image)).toEqual(true);
  });

  it('should be inValid', async () => {
    expect(isImage(imageInvalid)).toEqual(false);
  });

  it('validateImage ', async () => {
    const imageTyped: Image = await validateImage(image).toPromise();
    expect(imageTyped).toMatchInlineSnapshot(`
      Object {
        "height": 100,
        "url": "http://imgURL.hu",
        "width": 100,
      }
    `);
  });
  it('validateImage invalid', async () => {
    await validateImage(imageInvalid)
      .toPromise()
      .catch(error => {
        expect(error).toMatchInlineSnapshot(`
          Array [
            Object {
              "exception": "any.required",
              "message": "\\"url\\" is required",
              "path": Array [
                "url",
              ],
            },
          ]
        `);
      });
  });
});
