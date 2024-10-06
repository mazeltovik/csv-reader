'use client';
import { createContext, SetStateAction, useState } from 'react';
import { Product } from '@/components/ui/csvData/columns';

type PopupContextType = {
  open: boolean;
  data: Product;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<Product>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
};

const PopupContext = createContext<PopupContextType>({
  open: false,
  data: {
    id: '',
    product: '',
    status: '',
    fulfilmentCentr: '',
    qty: '',
    value: '',
  },
  setOpen: () => {},
  setData: () => {},
  id: '',
  setId: () => {},
});

export const PopupProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [data, setData] = useState<Product>({});
  return (
    <PopupContext.Provider
      value={{
        open,
        data,
        setData,
        setOpen,
        id,
        setId,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export default PopupContext;
