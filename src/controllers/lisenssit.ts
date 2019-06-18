import { NextFunction, Request, Response } from "express";

import { getDataFromApi } from "../util/api.utils";
import { getAsync, setAsync } from "../util/redis.utils";

const endpoint = "edtech/codeschemes/Licence";
const rediskey = "lisenssit";
const params = "codes/?format=json";

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 *
 * @todo Implement error handling
 */
export async function setLisenssit(): Promise<any> {
  const results = await getDataFromApi(
    process.env.KOODISTOT_SUOMI_URL,
    `/${endpoint}/`,
    { "Accept": "application/json" },
    params
  );

  const data = results.results.map((result: any) => {
    return {
      key: result.codeValue,
      value: {
        fi: result.prefLabel.fi,
        en: result.prefLabel.en,
        sv: result.prefLabel.sv,
      }
    };
  });

  await setAsync(rediskey, JSON.stringify(data));
}

/**
 * Get data from redis database
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {Promise<any>}
 */
export const getLisenssit = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const redisData = await getAsync(rediskey);

  if (redisData) {
    const input = JSON.parse(redisData);

    const output = input.map((row: any) => {
      return {
        key: row.key,
        value: row.value[req.params.lang] != undefined ? row.value[req.params.lang] : row.value["fi"],
      };
    });

    output.sort((a: any, b: any) => a.key.localeCompare(b.key));

    if (output.length > 0) {
      res.status(200).json(output);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);

    return next();
  }
};

/**
 * Get single row from redis database key-value
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {Promise<any>}
 */
export const getLisenssi = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const redisData = await getAsync(rediskey);

  if (redisData) {
    const input = JSON.parse(redisData);
    const row = input.find((e: any) => e.key === req.params.key);
    let output: object;

    if (row != undefined) {
      output = {
        key: row.key,
        value: row.value[req.params.lang] != undefined ? row.value[req.params.lang] : row.value["fi"],
      };
    }

    if (output != undefined) {
      res.status(200).json(output);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);

    return next();
  }
};