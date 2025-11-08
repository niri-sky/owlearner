import { CART_STATE, WISHLIST_STATE } from "@/shared/state";
import { useAtom } from "jotai";
import React from "react";
import CartItem from "./CartItem";

function WishlistPage() {
  const [wishlistState, setWishlistState] = useAtom(WISHLIST_STATE);
  const [cartState, setCartState] = useAtom(CART_STATE);

  const handleRemoveWishlist = (slug: string) => {
    const prevWishlist = [...wishlistState];
    const filterWishlist = prevWishlist.filter((w) => w.slug != slug);

    setWishlistState(filterWishlist);
  };

  const wishlistToCart = (slug: string) => {
    const prevWishlist = [...wishlistState];
    const findWishlist = prevWishlist.find((w) => w.slug === slug);
    const filterWishlist = prevWishlist.filter((w) => w.slug != slug);

    setWishlistState(filterWishlist);
    if (findWishlist) {
      setCartState((s) => [...s, findWishlist]);
    }
  };

  if (wishlistState.length == 0) return null;

  return (
    <div>
      <div className="text-[24px] leading-[1] font-bold text-[#2d2f31]">
        Wishlist
      </div>
      <div className="pt-[32px]"></div>
      <div className="flex">
        <div className="lg:w-[70%]">
          <div>
            <div className="pt-2"></div>
            {wishlistState?.map((v, i) => (
              <CartItem
                data={v}
                key={"gdghs" + i}
                type="wishlist"
                onItemClick={() => handleRemoveWishlist(v.slug)}
                onAddToCartClick={() => wishlistToCart(v.slug)}
              />
            ))}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
