'use client';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import usePopup from '@/hooks/use-popup';
import { Button } from './button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Product } from './csvData/columns';
import { update } from '@/lib/processCsv';
import { useToast } from '@/hooks/use-toast';

export default function Popup({
  tableData,
  setTableData,
}: {
  tableData: Product[];
  setTableData: Dispatch<SetStateAction<Product[]>>;
}) {
  const { open, setOpen, setData, data, id } = usePopup();
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('');
  const [fulfilmentCentr, setFulfilmentCentr] = useState('');
  const [qty, setQty] = useState('');
  const [value, setValue] = useState('');
  const { toast } = useToast();
  useEffect(() => {
    setProduct(data.product);
    setStatus(data.status);
    setFulfilmentCentr(data.fulfilmentCentr);
    setQty(data.qty);
    setValue(data.value);
  }, [data]);
  return (
    <Popover open={open}>
      <PopoverTrigger
        asChild
        className="fixed inset-0 opacity-0 pointer-events-none flex items-center justify-center"
      >
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-neutral-100">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Change data</h4>
            <p className="text-sm text-muted-foreground">
              You can change your table data:
            </p>
            <p>Product name:</p>
            <Input disabled type="text" placeholder={product} />
            <p>Status:</p>
            <Select defaultValue={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Sellable">Sellable</SelectItem>
                  <SelectItem value="Unfulfillable">Unfulfillable</SelectItem>
                  <SelectItem value="Inbound">Inbound</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p>Fulfilment centr:</p>
            <Select
              defaultValue={fulfilmentCentr}
              onValueChange={setFulfilmentCentr}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fulfilment centr" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="fc1">fc1</SelectItem>
                  <SelectItem value="fc2">fc2</SelectItem>
                  <SelectItem value="fc3">fc3</SelectItem>
                  <SelectItem value="fc4">fc4</SelectItem>
                  <SelectItem value="fc5">fc5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p>Qty:</p>
            <Input
              type="text"
              placeholder="Qty"
              defaultValue={qty}
              onChange={(event) => {
                setQty(event.target.value);
              }}
            />
            <p>Value:</p>
            <Input
              type="text"
              placeholder="Value"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={async () => {
                  const updateData = {
                    changeId: id,
                    data: {
                      status,
                      fulfilmentCentr,
                      qty,
                      value,
                      id: data.id,
                      product: data.product,
                    },
                  };
                  const updatedData = await update(updateData);
                  if (updatedData) {
                    setTableData(
                      tableData.map((product) => {
                        if (product.id == updatedData.id) {
                          return updatedData;
                        } else {
                          return product;
                        }
                      })
                    );
                    toast({
                      title: 'Success',
                      description: 'You have successfully updated the table',
                      className: 'bg-lime-500',
                    });
                  } else {
                    toast({
                      variant: 'destructive',
                      title: 'Uh oh! Something went wrong.',
                      description: 'Can`t update the table',
                    });
                  }
                  setOpen(false);
                }}
              >
                Change
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
