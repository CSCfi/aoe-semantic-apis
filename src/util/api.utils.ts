import rp from 'request-promise';

import { HttpHeaders } from '../models/httpheaders';
import { winstonLogger } from '../util';

export async function getDataFromApi(
  api: string,
  route?: string,
  headers?: HttpHeaders,
  params?: string,
): Promise<any> {
  try {
    const options = {
      url: `${api}${route}${params}`,
      headers: headers,
    };
    const body = await rp.get(options);

    if (headers?.Accept === 'application/json') {
      return JSON.parse(body);
    } else {
      return body;
    }
  } catch (err) {
    winstonLogger.error('Error getting data from ' + api + ': %o', err);
  }
}
