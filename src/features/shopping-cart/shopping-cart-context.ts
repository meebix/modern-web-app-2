import React from 'react';
import { CartProduct } from '@typings/api/product';

export type ShoppingCartContext = {
  items: CartProduct[];
  quantity: number;
  total: number;
  addCartItem: (item: CartProduct) => void;
  incrementItem: (item: CartProduct) => void;
  decrementItem: (item: CartProduct) => void;
  removeCartItem: (item: CartProduct) => void;
  deleteCart: ({ browser }: { browser: boolean }) => void;
  calculateQuantity: (items: CartProduct[]) => number;
};

export const ShoppingCartContext = React.createContext<ShoppingCartContext>({
  items: [],
  quantity: 0,
  total: 0,
  addCartItem: () => {},
  incrementItem: () => {},
  decrementItem: () => {},
  removeCartItem: () => {},
  deleteCart: () => {},
  calculateQuantity: () => 0,
});
