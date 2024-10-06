'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import processCsv from '@/lib/processCsv';
import { Product, columns } from '@/components/ui/csvData/columns';
import { DataTable } from '@/components/ui/csvData/data-table';
import Popup from '@/components/ui/popup';
import usePopup from '@/hooks/use-popup';

const ACCEPTED_FILE_TYPES = ['text/csv'];

type ProductLink = {
  id: string;
};

type ProductLinks = ProductLink[];

export default function Home() {
  const [tableData, setTableData] = useState<Product[]>([]);
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const { setId } = usePopup();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const handleUploadCSV = async () => {
    const input = inputRef.current;
    const reader = new FileReader();
    const file = input?.files?.item(0);
    if (file) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Please select a csv file.',
        });
      } else {
        reader.onloadend = async ({ target }) => {
          const result = target?.result;
          if (result) {
            try {
              const { headers, data, id } = await processCsv(
                file.name,
                target.result as string
              );
              setTableHeader(headers);
              setTableData(data);
              setId(id);
            } catch (err) {
              if (err instanceof Error) {
                toast({
                  variant: 'destructive',
                  title: 'Uh oh! Something went wrong.',
                  description: `${err.message}`,
                });
              }
            }
          }
        };
        reader.readAsText(file);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please select a csv file.',
      });
    }
  };
  return (
    <div className="flex mx-20 flex-col gap-4">
      <Card className="w-full">
        <CardHeader className="items-center">
          <CardTitle>Please, select any CSV file.</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <input
              type="file"
              id="file"
              className={styles.addInput}
              name="file"
              accept=".csv"
              ref={inputRef}
              onChange={() => {}}
            />
            <Button onClick={handleUploadCSV}>Submit</Button>
          </div>
        </CardContent>
      </Card>
      {tableData.length ? (
        <DataTable columns={columns} data={tableData} />
      ) : (
        <Card className="w-full">
          <CardHeader className="items-center">
            <CardTitle>
              You haven`t got any CSV file, please select one.
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      <Popup tableData={tableData} setTableData={setTableData} />
    </div>
  );
}
