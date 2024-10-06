'use server';
import { open, mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/components/ui/csvData/columns';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filesPath = path.join(process.cwd(), 'csv');

const files = new Map<string, Product[]>();

export default async function processCsv(fileName: string, data: string) {
  const dest = path.join(filesPath, `${fileName}`);
  const isSave = await saveCsv(dest, data);
  if (isSave) {
    const { headerRow, headers } = await createHeaders(dest);
    const data = await fillRes(dest, headerRow, headers);
    await unlink(dest);
    files.clear();
    const id = uuidv4();
    files.set(id, data);
    return { headers, data, id };
  }
  return { headers: [], data: [], id: '' };
}

export async function update({
  changeId,
  data,
}: {
  changeId: string;
  data: Product;
}) {
  let products = files.get(changeId);
  if (products) {
    products = products.map((product) => {
      if (product.id == data.id) {
        return data;
      } else {
        return product;
      }
    });
    files.set(changeId, products);
    return data;
  }
}

async function saveCsv(dest: string, data: string) {
  const isDir = await mkdir(filesPath, { recursive: true });
  const result = await writeFile(dest, data);
  return true;
}

async function openCsv(dest: string) {
  const file = await open(dest);
  return file;
}

async function createHeaders(dest: string) {
  const file = await openCsv(dest);
  let headerRow = 0;
  let headers: string[] = [];
  for await (const line of file.readLines()) {
    if (line.length) {
      headerRow += 1;
      headers = line
        .trim()
        .split(';')
        .map((line) => {
          const processingLine = line.toLocaleLowerCase().trim();
          if (processingLine.indexOf(' ') >= 0) {
            let [word, ...camelArr] = processingLine.split(' ');
            camelArr = camelArr.map((word) => {
              return word[0].toUpperCase() + word.slice(1);
            });
            return word + camelArr.join('');
          }
          return processingLine;
        })
        .filter((line) => line.length);
      break;
    }
    headerRow += 1;
  }
  return { headerRow, headers };
}

async function fillRes(dest: string, headerRow: number, headers: string[]) {
  const res: Product[] = [];
  let rowsCount = 1;
  const file = await openCsv(dest);
  for await (const line of file.readLines()) {
    const id = uuidv4();
    if (rowsCount <= headerRow) {
      rowsCount += 1;
      continue;
    } else {
      if (line.length) {
        const data = line
          .trim()
          .split(';')
          .filter((line) => line.length)
          .map((line, index) => {
            line = line.trim();
            return [headers[index], line];
          });
        res.push({ id, ...Object.fromEntries(data) });
      } else break;
    }
  }
  return res;
}
