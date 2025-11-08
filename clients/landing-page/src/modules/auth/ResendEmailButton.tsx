import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  handleResendEmail: () => any;
};

function ResendEmailButton({ handleResendEmail }: Props) {
  const [timer, setTimer] = useState(() => {
    const item =
      typeof window !== "undefined" && window.localStorage.getItem("timer");
    return Number(item) || 0;
  });

  const initialTimer = (num?: number) => {
    setTimer(num || 60);
    let timerVar = num || 60;
    const interval = setInterval(() => {
      if (timerVar === 0) {
        setTimer(0);
        localStorage.setItem("timer", "0");

        clearInterval(interval);
        return;
      }
      timerVar--;
      localStorage.setItem("timer", timerVar + "");
      setTimer(timerVar);
    }, 1000);
  };

  useEffect(() => {
    if (timer && timer > 0) {
      initialTimer(timer);
    }
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [loading, setLoading] = useState(false);

  const onResend = async () => {
    if (loading) return;
    try {
      setLoading(true);
      handleResendEmail();
      initialTimer();
      toast.success("Email sent");
      setLoading(false);
    } catch (err: any) {
      toast.error("Something went wrong, Please try again later")
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="  text-center  text-primary-text">
        Didn&apos;t get the code?{" "}
        {!mounted ? (
          "00:00"
        ) : timer != 0 ? (
          `00:${timer.toString().padStart(2, "0")}`
        ) : (
          <button className="font-bold text-primary" onClick={onResend}>
            Resend
          </button>
        )}
      </h2>
    </div>
  );
}

export default ResendEmailButton;
