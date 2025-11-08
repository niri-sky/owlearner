"use client";
import { useAtom } from "jotai";
import React from "react";
import { CART_STATE, WISHLIST_STATE } from "../state";

function useWishlistCart() {
  const [cartState, setCartState] = useAtom(CART_STATE);
  const [wishlistState, setWishlistState] = useAtom(WISHLIST_STATE);

  const handleAddToWishlist = (d?: CourseData) => {
    if (!d) return;
    if (!isExistOnWishlist(d.slug)) {
      setWishlistState((s) => [...s, d]);
    } else {
      handleRemoveWishlist(d.slug);
    }
  };

  const handleRemoveWishlist = (slug?: string) => {
    if (!slug) return;
    const prevWishlist = [...wishlistState];
    const filterWishlist = prevWishlist.filter((w) => w.slug != slug);

    setWishlistState(filterWishlist);
  };

  const handleAddToCart = (d?: CourseData) => {
    if (!d) return;
    if (!isExistOnCart(d.slug)) {
      if (isExistOnWishlist(d.slug)) {
        handleRemoveWishlist(d.slug);
      }
      setCartState((s) => [...s, d]);
    }
  };

  const handleRemoveCart = (slug?: string) => {
    if (!slug) return;

    if (slug == "REMOVE_ALL") {
      setCartState([]);
      return;
    }

    const prevCart = [...cartState];
    const filterCart = prevCart.filter((c) => c.slug != slug);

    setCartState(filterCart);
  };

  const isExistOnCart = (slug?: string) => {
    return cartState?.find((c) => c.slug === slug) ? true : false;
  };
  const isExistOnWishlist = (slug?: string) => {
    return wishlistState?.find((w) => w.slug === slug) ? true : false;
  };

  return {
    cartState,
    wishlistState,
    isExistOnCart,
    isExistOnWishlist,
    handleAddToCart,
    handleRemoveWishlist,
    handleAddToWishlist,
    handleRemoveCart,
  };
}

export default useWishlistCart;
