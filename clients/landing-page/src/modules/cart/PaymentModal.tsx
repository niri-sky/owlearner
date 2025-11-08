import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import React, { useState } from "react";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_SALE,
  CREATE_SALES,
  PAYMENT_INTENDS,
  SINGLE_STUDENT_QUERY,
  UPDATE_COUPON,
  UPDATE_STUDENT,
} from "@/graphql/queries";
import { CouponType } from "./CartPage";
import useUserData from "@/shared/hooks/useUserData";
import useWishlistCart from "@/shared/hooks/useWishlistCart";
import { useRouter } from "next/navigation";
import useCreateNotification from "@/shared/hooks/use-create-notification";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

type Props = {
  price: number;
  coupon?: CouponType;
};

function PaymentModal({ price, coupon }: Props) {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Payment</ModalHeader>
          <ModalBody>
            <PaymentMethodForm price={price} coupon={coupon} />
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
}

type FormProps = {
  price: number;
  coupon?: CouponType;
};

function PaymentMethodForm({ price, coupon }: FormProps) {
  const { data, stopPolling } = useQuery(PAYMENT_INTENDS, {
    variables: {
      price,
    },
    initialFetchPolicy: "no-cache",
    nextFetchPolicy: "standby",
    skip: !price || price < 1,
  });

  const clientSecret = data?.createIntends?.clientSecret;

  const options: StripeElementsOptions = {
    clientSecret: clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        borderRadius: "6px",
        colorText: "#252C48",
        colorTextPlaceholder: "#A0A4AB",
        focusBoxShadow: "none",
        focusOutline: "#7266FC",
        colorPrimary: "#7266FC",
        spacingGridRow: "20px",
        spacingUnit: "5px",
        fontSmooth: "always",
        colorDanger: "#FF000D",
        colorDangerText: "#FF000D",
      },
    },
  };

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm coupon={coupon} price={price} />
        </Elements>
      ) : (
        <div className="flex mb-5 items-center gap-4">
          <Spinner size="sm" />
          <div className="text-lg">Loading...</div>
        </div>
      )}
    </>
  );
}

type PaymentFormProps = {
  coupon?: CouponType;
  price: number;
};

function PaymentForm({ coupon, price }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const { userData } = useUserData();

  const { cartState, handleRemoveCart } = useWishlistCart();

  const [isReady, setReady] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [updateCoupon] = useMutation(UPDATE_COUPON);
  const [updateStudent] = useMutation(UPDATE_STUDENT, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_STUDENT_QUERY,
        variables: {
          id: Number(userData?.id),
        },
      },
    ],
  });

  const [createSales] = useMutation(CREATE_SALES);

  const { createNotification } = useCreateNotification();

  const router = useRouter();

  console.log(cartState);

  const handleSubmit = async (e: any) => {
    if (loading) return;
    e.preventDefault();
    try {
      setLoading(true);
      if (!stripe || !elements) throw new Error("Stripe or elements not found");

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/billing`,
        },

        redirect: "if_required",
      });

      if (error) throw new Error(error.message);

      console.log(paymentIntent);

      if (coupon) {
        await updateCoupon({
          variables: {
            id: Number(coupon.id),
            input: {
              couponUsed: {
                create: {
                  student: {
                    connect: {
                      id: Number(userData?.id),
                    },
                  },
                },
              },
            },
          },
        });
      }

      const obj = {
        id: Number(userData?.id),
        input: {
          courses: {
            create: cartState.map((v) => ({
              course: {
                connect: {
                  id: Number(v.id),
                },
              },
            })),
          },
          invoices: {
            create: Object.assign(
              {
                price: price,
                courses: {
                  connect: cartState.map((v) => ({
                    id: Number(v?.id),
                  })),
                },
              },
              coupon && {
                coupon: {
                  connect: {
                    id: Number(coupon?.id),
                  },
                },
              }
            ),
          },
        },
      };

      const createSalesArray = cartState.map((v) => ({
        price: reducePriceByPercentage(
          v.price,
          getCouponPercent(price, coupon)
        ),
        courseId: Number(v.id),
        studentId: Number(userData?.id),
        teacherEarningId: Number(v?.teacher?.teacherEarning?.id),
      }));

      console.log(createSalesArray);

      await createSales({
        variables: {
          input: createSalesArray,
        },
      });

      await updateStudent({
        variables: obj,
      });

      cartState.forEach((v) => {
        createNotification({
          link: "/courses",
          text: `purchase <strong>${v.title}</strong> course`,
          sender: {
            type: "student",
            id: userData?.id,
          },
          receiver: {
            type: "teacher",
            id: v?.teacher?.id,
          },
        });
      });

      handleRemoveCart("REMOVE_ALL");
      router.push("/dashboard");
      // setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={() => setReady(true)} />

      <div className="pt-2 xl:pt-3"></div>
      {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
      <div className="pt-4"></div>
      {isReady && (
        <Button
          className="w-full"
          type="submit"
          radius="sm"
          size="lg"
          color="primary"
          disabled={loading}
          isIconOnly={loading}
          startContent={loading && <Spinner size="sm" color="default" />}
        >
          {!loading && "Pay Now"}
        </Button>
      )}
      <div className="pt-4"></div>
    </form>
  );
}

function reducePriceByPercentage(price: number, percent: number): number {
  const reduction: number = (price * percent) / 100;
  return price - reduction;
}

function getCouponPercent(price: number, coupon?: CouponType) {
  if (!coupon) return 0;
  if (coupon.type == "percent") return coupon.discount;

  const totalPrice = coupon.discount + price;

  return (coupon.discount / totalPrice) * 100;
}

export default PaymentModal;
