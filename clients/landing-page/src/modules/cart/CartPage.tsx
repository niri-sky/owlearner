import { CART_STATE } from "@/shared/state";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import CartItem from "./CartItem";
import { Modal, Spinner, cn, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import useWishlistCart from "@/shared/hooks/useWishlistCart";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { VALIDATE_COUPON } from "@/graphql/queries";
import { BiCross } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import rswitch from "rswitch";
import { calculatePercentageOff } from "../course/course-details/RightDetails";
import PaymentModal from "./PaymentModal";
import useUserData from "@/shared/hooks/useUserData";

export type CouponType = {
  id: string;
  name: string;
  code: string;
  type: "percent" | "amount";
  discount: number;
};

function CartPage() {
  const { cartState, handleRemoveCart, handleAddToWishlist } =
    useWishlistCart();

  const [coupon, setCoupon] = useState<CouponType>();

  const { currentValue, oldValue, percentDiscount } = useMemo(() => {
    const totalValue = cartState.reduce((prev, d) => prev + d.price, 0);

    let oldValue = totalValue;

    let currentValue = totalValue;

    let percentDiscount = 0;

    console.log(coupon);

    if (coupon) {
      if (coupon?.type == "amount") {
        currentValue = totalValue - coupon.discount;
        percentDiscount = calculatePercentageOff(totalValue, currentValue);
      }
      if (coupon.type == "percent") {
        currentValue = totalValue - (totalValue / 100) * coupon.discount;
        percentDiscount = coupon.discount;
      }
    }

    return { currentValue, oldValue, percentDiscount };
  }, [cartState, coupon]);

  const { isOpen, onOpenChange } = useDisclosure();

  const { userData } = useUserData();

  return (
    <div>
      <div className="text-[40px] leading-[1] font-bold text-[#2d2f31]">
        Shopping Cart
      </div>
      <div className="pt-[32px]"></div>
      <div className="flex flex-col lg:flex-row">
        <div className={cn(cartState.length > 0 ? "lg:w-[70%]" : "w-full")}>
          <div>
            <div className="text-[#2d2f31] font-bold">
              {cartState?.length} Course in Cart
            </div>
            <div className="pt-2"></div>
            {cartState.length > 0 ? (
              cartState?.map((v, i) => (
                <CartItem
                  data={v}
                  key={"gdghs" + i}
                  onItemClick={() => handleRemoveCart(v.slug)}
                  onAddToCartClick={(e) => {
                    handleRemoveCart(v.slug);
                    handleAddToWishlist(v);
                  }}
                />
              ))
            ) : (
              <div className="h-[300px] flex items-center flex-col justify-center font-bold text-xl">
                <div className="text-sm">
                  Your cart is empty. Keep shopping to find a course!
                </div>
                <div className="pt-5"></div>
                <Link href={"/courses"}>
                  <button className="h-[38px] text-sm font-bold bg-primary text-[#fff] px-5">
                    Keep Shopping
                  </button>
                </Link>
              </div>
            )}

            <div></div>
          </div>
        </div>
        {cartState.length > 0 && (
          <div className="lg:w-[30%] lg:pl-[60px]">
            <div>
              <div className="font-bold text-[#6a6f73]">Total:</div>
              <div className="pt-2"></div>
              <div className="flex justify-between items-center">
                <div className="text-[32px] font-bold  text-[#2d2f31]">
                  ${currentValue}{" "}
                  {coupon && (
                    <span className="line-through text-xl">${oldValue}</span>
                  )}
                </div>
                {coupon && (
                  <div className="text-[#C713CB] bg-[#FFEEE8] font-dmsans font-medium text-sm leading-[1] p-[8px_12px]">
                    {percentDiscount}% off
                  </div>
                )}
              </div>
            </div>
            <div className="pt-2"></div>
            {coupon && (
              <div className="font-bold text-sm gap-1 flex items-center">
                <button
                  onClick={() => {
                    setCoupon(undefined);
                  }}
                >
                  <IoMdClose size={16} color="#C713CB" />
                </button>
                <div>
                  <span className="text-primary">{coupon.code}</span> Coupon is
                  applied
                </div>
              </div>
            )}

            {userData ? (
              <div>
                <div className="pt-2"></div>

                <div>
                  <button
                    onClick={onOpenChange}
                    className="h-[48px] w-full font-bold  bg-primary text-[#fff]"
                  >
                    Checkout
                  </button>
                </div>
                <hr className="border-[#d1d7dc] border-t my-4" />

                <div>
                  <div className="font-bold text-[#2d2f31]">Promotions</div>
                </div>
                <div className="pt-4"></div>
                <div className={cn(coupon && "opacity-50 pointer-events-none")}>
                  <CouponForm
                    onValidatedCoupon={(d) => {
                      setCoupon(d);
                    }}
                    totalValue={currentValue}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <div>Want to purchase?</div>
                  <div className="pt-2"></div>

                  <Link href={"/auth"}>
                    <button className="h-[48px] w-full font-bold  bg-primary text-[#fff]">
                      Join Now
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <PaymentModal price={currentValue} coupon={coupon} />
      </Modal>
    </div>
  );
}

const formSchema = yup.object({
  coupon: yup.string().required(""),
});

type FormType = yup.InferType<typeof formSchema>;

type CouponFormProps = {
  onValidatedCoupon: (d: any) => any;
  totalValue: number;
};

function CouponForm({ onValidatedCoupon, totalValue }: CouponFormProps) {
  const [error, setError] = useState("");
  const [validateCoupon, { loading }] = useMutation(VALIDATE_COUPON, {
    onCompleted: (data, clientOptions) => {
      let oldValue = totalValue;

      let currentValue = totalValue;

      let percentDiscount = 0;

      const coupon = data?.validateCoupon;

      if (coupon) {
        if (coupon?.type == "amount") {
          currentValue = totalValue - coupon.discount;
          percentDiscount = calculatePercentageOff(totalValue, currentValue);
        }
        if (coupon.type == "percent") {
          currentValue = totalValue - (totalValue / 100) * coupon.discount;
          percentDiscount = coupon.discount;
        }
      }
      if (currentValue <= 0) {
        return setError("Coupon not applicable");
      }
      onValidatedCoupon(data?.validateCoupon);
      setError("");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit((d) => validateCoupon({ variables: d }))}>
      <div className="h-[34px] flex ">
        <input
          type="text"
          className={cn(
            "flex-1 h-full focus:outline-none border-l border-t border-b border-[#2d2f31] px-4 text-sm",
            (errors.coupon || error) && "border-red-500"
          )}
          placeholder="Enter coupon"
          {...register("coupon")}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 bg-primary flex items-center justify-center font-bold text-[#fff] w-[80px]"
        >
          {loading ? <Spinner size="sm" color="default" /> : "Apply"}
        </button>
      </div>
      {error && <div className="text-sm mt-1 text-red-500">{error}</div>}
    </form>
  );
}

export default CartPage;
