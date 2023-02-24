import { Readability } from '@mozilla/readability';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { JSDOM } from 'jsdom';
import path from 'path';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const objectToJsonWithTruncatedUrls = (obj: any) => {
  const MAX_STR_LENGTH = 50;
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'string') {
        return value.length > MAX_STR_LENGTH
          ? value.slice(0, MAX_STR_LENGTH) + '...'
          : value;
      } else {
        return value;
      }
    },
    2
  );
};

export function splitByFirstSpace(str: string) {
  const index = str.indexOf(' ');
  if (index === -1) {
    return [str];
  } else {
    return [str.slice(0, index), str.slice(index + 1)];
  }
}

export const getFieldNameByType = (service: any, type: string) => {
  const field = service.params.find((item: any) => item.type === type);
  if (!field) return null;
  return field.name;
};

export function downloadFile(url: string, outputDir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const { statusCode } = response;
        const contentType = response.headers['content-type'];

        if (statusCode !== 200) {
          reject(new Error(`Request failed with status code ${statusCode}`));
          return;
        }

        let fileName = (url.split('/').pop() || '').split('?')[0];
        let fileExtension = path.extname(fileName);
        if (fileExtension === '') {
          fileExtension = (contentType || '').split('/')[1];
        }

        const outputPath = path.join(outputDir, fileName);

        const writeStream = fs.createWriteStream(outputPath);
        response.pipe(writeStream);

        writeStream.on('finish', () => {
          writeStream.close(() => {
            resolve(outputPath);
          });
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export async function getReadableContentFromUrl(url: string) {
  try {
    const response = await axios.get(url);
    const doc = new JSDOM(response.data, { url }).window.document;
    const reader = new Readability(doc);
    const article = reader.parse();
    const readableContent = article?.textContent;
    return readableContent;
  } catch (error) {
    console.error(error);
    return null;
  }
}
