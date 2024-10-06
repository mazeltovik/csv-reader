'use client';

import usePopup from '@/hooks/use-popup';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Product = {
  id: string;
  product: string;
  status: string;
  fulfilmentCentr: string;
  qty: string;
  value: string;
};

const CellComponent = ({ row }: { row: Row<Product> }) => {
  const { setOpen, setData } = usePopup();
  const product = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setData(product);
            setOpen(true);
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'product',
    header: 'Product',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'fulfilmentCentr',
    header: 'Fulfilment centr',
  },
  {
    accessorKey: 'qty',
    header: 'Qty',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
  {
    id: 'actions',
    cell: CellComponent,
  },
];
