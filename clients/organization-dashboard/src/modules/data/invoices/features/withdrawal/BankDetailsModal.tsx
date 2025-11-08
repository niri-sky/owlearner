import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import React from "react";

type Props = {
  bankDetails: string;
};

function BankDetailsModal({ bankDetails }: Props) {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Bank detail here
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-3">
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: bankDetails }}
              ></div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

export default BankDetailsModal;
