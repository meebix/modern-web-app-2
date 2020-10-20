import React from 'react';
import { useGetProducts } from '@modules/queries/products';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { useActor } from '@components/hooks/use-actor';
import { useGetActorCart } from '@modules/queries/actor';
import { Button } from '@components/app';
import { ShoppingCart } from '@features/shopping-cart';
// import styles from './products.module.scss';

const Products = () => {
  const {
    items,
    quantity,
    total,
    addCartItem,
    removeCartItem,
    updateCart,
    incrementItem,
    decrementItem,
    calculateQuantity,
  } = useShoppingCart();
  const [actorId] = useActor();
  const { data: response, isLoading } = useGetProducts();
  const { data: cartItems } = useGetActorCart(actorId, {
    enabled: !!actorId,
  });

  const products = response?.data;
  const actorCartItems = cartItems?.data;
  const shoppingCartItems = actorId ? actorCartItems : items;
  const shoppingCartQuantity = actorId
    ? calculateQuantity(actorCartItems)
    : quantity;

  return (
    <div>
      <div className="my-4 mx-8">
        <div className="flex justify-end mb-4">
          <ShoppingCart
            items={shoppingCartItems}
            quantity={shoppingCartQuantity}
            total={total}
            incrementItem={(item) => incrementItem(item)}
            decrementItem={(item) => {
              decrementItem(item);
            }}
            updateCart={updateCart}
            removeCartItem={removeCartItem}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {!isLoading &&
            products?.map((result) => {
              const productPrice =
                (result.relationships?.price.unit_amount || 0) / 100;

              return (
                <div key={result.attributes.id}>
                  <img
                    src={`/images/products/${result.attributes.id}.jpg`}
                    alt={result.attributes.name}
                    width="100%"
                  />
                  <div>{result.attributes.name}</div>
                  <div>
                    {productPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </div>
                  <Button onClick={() => addCartItem(result)}>Buy Now</Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export { Products };
