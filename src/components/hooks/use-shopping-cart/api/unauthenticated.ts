import { GetProduct } from '@typings/entities/product';
import { ReducerAction } from '@typings/react';
import { getCartTotal } from '../utils';
import { types, ReducerState } from '../reducer';

const storageAddItem = (
  item: GetProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);
  let newCartItems: GetProduct[] = [];

  /* See if the items already exists */
  const existingItem = currentCart.items.find(
    (i) => i.attributes.id === item.attributes.id
  );

  if (existingItem) {
    existingItem.attributes.quantity += 1;
  } else {
    newCartItems = currentCart.items.concat({
      ...item,
      attributes: { ...item.attributes, quantity: 1 },
    });
  }

  const newCartTotal = getCartTotal(
    existingItem ? currentCart.items : newCartItems
  );

  storage.setItem(
    'cart',
    JSON.stringify({
      ...currentCart,
      items: existingItem ? currentCart.items : newCartItems,
      total: newCartTotal,
      status: 'active',
    })
  );

  dispatch({
    type: types.ADD_CART_ITEM,
    payload: {
      items: existingItem ? currentCart.items : newCartItems,
      total: newCartTotal,
    },
  });
};

const storageIncrementItem = (
  item: GetProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

  /* Find the existing item to increment */
  const existingItem = currentCart.items.find(
    (i) => i.attributes.id === item.attributes.id
  );

  if (existingItem) {
    existingItem.attributes.quantity += 1;

    const newCartTotal = getCartTotal(currentCart.items);

    storage.setItem(
      'cart',
      JSON.stringify({
        ...currentCart,
        items: currentCart.items,
        total: newCartTotal,
        status: 'active',
      })
    );

    dispatch({
      type: types.INCREMENT_CART_ITEM,
      payload: {
        items: currentCart.items,
        total: newCartTotal,
      },
    });
  }
};

const storageDecrementItem = (
  item: GetProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

  /* Get the existing item to decrement */
  const existingItem = currentCart.items.find(
    (i) => i.attributes.id === item.attributes.id
  );

  if (existingItem) {
    existingItem.attributes.quantity -= 1;

    const newCartTotal = getCartTotal(currentCart.items);

    storage.setItem(
      'cart',
      JSON.stringify({
        ...currentCart,
        items: currentCart.items,
      })
    );

    dispatch({
      type: types.DECREMENT_CART_ITEM,
      payload: {
        items: currentCart.items,
        total: newCartTotal,
      },
    });
  }
};

const storageRemoveItem = (
  item: GetProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const storageCart = storage.getItem('cart') || '{}';
  const currentCart: ReducerState = JSON.parse(storageCart);

  const newCartItems = currentCart.items.filter(
    (product: GetProduct) => item.attributes.id !== product.attributes.id
  );

  const cartStatus = newCartItems.length > 0 ? 'active' : 'new';

  const newCartTotal = getCartTotal(newCartItems);

  storage.setItem(
    'cart',
    JSON.stringify({
      ...currentCart,
      items: newCartItems,
      status: cartStatus,
    })
  );

  dispatch({
    type: types.REMOVE_CART_ITEM,
    payload: {
      items: newCartItems,
      total: newCartTotal,
      status: cartStatus,
    },
  });
};

const storageUpdateCart = (
  items: GetProduct[],
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const storage = window.localStorage;
  const newCartTotal = getCartTotal(items);

  storage.setItem(
    'cart',
    JSON.stringify({
      items,
      total: newCartTotal,
      status: 'active',
    })
  );

  dispatch({
    type: types.SYNC_CART,
    payload: {
      items,
      total: newCartTotal,
    },
  });
};

const storageClearCart = () => {
  const storage = window.localStorage;
  storage.removeItem('cart');
};

export {
  storageAddItem,
  storageRemoveItem,
  storageIncrementItem,
  storageDecrementItem,
  storageUpdateCart,
  storageClearCart,
};
