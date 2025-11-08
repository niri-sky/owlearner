import { IoMdClose } from "react-icons/io";
import cls from "classnames";

// custom file imports

/* -------------------------------------------------------------------------- */
/*                                    modal                                   */
/* -------------------------------------------------------------------------- */
const Modal: React.FC<ModalProps> = ({
  children,
  open,
  setOpen,
  close,
  className,
}) => {
  if (!open) return <></>;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-[1000000000000] flex items-center justify-center">
      <div
        className="absolute top-0 bottom-0 left-0 right-0"
        onClick={() => setOpen(false)}
      />

      <div
        className={cls(
          "bg-light-bg",
          "relative z-10 py-[20px] px-[15px] xl:px-[30px] rounded-[8px] max-h-[95vh] overflow-y-auto no-scrollbar shadow-2xl shadow-black",
          className
        )}
      >
        <IoMdClose
          className={cls(
            "absolute top-[10px] z-[9999] right-[10px] text-sm cursor-pointer bg-white text-dark-red w-7 h-7 rounded-full ",
            close
          )}
          onClick={() => setOpen(false)}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
