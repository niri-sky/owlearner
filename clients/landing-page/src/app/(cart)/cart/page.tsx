"use client";
import CartPage from "@/modules/cart/CartPage";
import WishlistPage from "@/modules/cart/WishlistPage";
import { CART_STATE, WISHLIST_STATE } from "@/shared/state";
import { useAtomValue } from "jotai";
import React from "react";

function Cart() {
  return (
    <div className="container">
      <div className="pt-[32px]"></div>
      <CartPage />
      <WishlistPage />
      <div className="pt-20"></div>
    </div>
  );
}

export default Cart;
