'use client';
import { useContext } from 'react';
import PopupContext from '@/app/context/popup-context';

const usePopup = () => useContext(PopupContext);

export default usePopup;
