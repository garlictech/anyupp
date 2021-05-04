/* eslint-disable @typescript-eslint/no-unused-vars */
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
  height: Joi.number().integer().positive().optional(),
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
  'Image',
);

describe('JOI validaton test', () => {
  it('should be valid', async () => {
    expect(isImage(image)).toEqual(true);
  });

  it('should be inValid', async () => {
    expect(isImage(imageInvalid)).toEqual(false);
  });

  it('validateImage ', async () => {
    const { height, ...imageWithoutHeight } = image;
    const imageTyped: Image = await validateImage(
      imageWithoutHeight,
    ).toPromise();
    expect(imageTyped).toMatchInlineSnapshot(`
      Object {
        "url": "http://imgURL.hu",
        "width": 100,
      }
    `);
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
        expect(error).toMatchInlineSnapshot(
          `"Image Object Validation Error: \\"url\\" is required"`,
        );
      });
  });
});
