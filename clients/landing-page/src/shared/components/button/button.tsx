import cls from "@/shared/libs/cls";
import { Button } from "@nextui-org/react";

interface Btntypes {
  className?: string;
  isLoading?: boolean;
  onClick?: React.Dispatch<React.SetStateAction<any>>;
  title:string;
}

const ButtonComponent = ({
  className,
  isLoading = false,
  title,
  onClick,
}: Btntypes) => {
  return (
    <Button
      isLoading={isLoading}
      className={cls("bg-primary rounded-full", className)}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ButtonComponent;
