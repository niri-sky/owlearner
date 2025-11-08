import { useMemo } from "react";
// global package
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
// icon
import { FOLLOWING_USERS, FOLLOW_USER } from "@/graphql/queries";
import { useSearchBar } from "@/shared/hooks/use-search-bar";
import useUserData from "@/shared/hooks/useUserData";
import { useMutation } from "@apollo/client";
import { CiSearch } from "react-icons/ci";
import UnfollowModal from "./UnfollowModal";

type Props = {
  data: FollowingUser[];
};

const FollowingModal = ({ data }: Props) => {
  const { userData } = useUserData();

  const { filterData, searchProps } = useSearchBar(data);

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Following</ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full gap-5">
              <div className="w-full">
                <div className="relative w-full bg-[#ececec] rounded-md">
                  <input
                    className="w-full py-2 pl-[30px] pr-2 rounded-md border border-[#dfdfdf] bg-[transparent] outline-none"
                    placeholder="Search"
                    type="search"
                    {...searchProps}
                  />
                  <span className="absolute left-[7px] top-[11px]">
                    <CiSearch className="text-[20px] text-[#7a7a7a]" />
                  </span>
                </div>
              </div>
              {filterData.map((user, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-full flex items-center gap-3">
                    <div>
                      <Avatar size="lg" src={user?.profile} />
                    </div>
                    <ul className="flex flex-col">
                      <li className="capitalize text-[gray] font-bold text-base">
                        {user?.name}
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="font-medium capitalize text-txt">
                          {user?.type}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <ButtonSection d={user} />
                </div>
              ))}
              <div className="pt-5"></div>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
};

function ButtonSection({ d }: { d: FollowingUser }) {
  const { userData } = useUserData();

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: FOLLOWING_USERS,
        variables: {
          studentId: Number(userData?.id),
        },
      },
    ],
  });

  const { isOpen, onOpenChange } = useDisclosure();

  const { idFollowed, followed } = useMemo(() => {
    const findFollowed = d.followers?.find((v) => v.studentId == userData?.id);

    return {
      idFollowed: !!findFollowed,
      followed: findFollowed,
    };
  }, [d, userData]);

  return (
    <>
      <div className="w-full flex justify-end">
        {idFollowed ? (
          <Button onClick={onOpenChange} className="capitalize" variant="solid">
            Followed
          </Button>
        ) : (
          <Button
            disabled={followLoading}
            isIconOnly={followLoading}
            color="primary"
            variant="flat"
            className="min-w-[80px]"
            startContent={
              followLoading && <Spinner size="sm" color="primary" />
            }
            onPress={() => {
              followUser({
                variables: {
                  input: {
                    userType: d.type,
                    student: {
                      connect: {
                        id: Number(userData?.id),
                      },
                    },
                    [d.type]: {
                      connect: {
                        id: Number(d.userId),
                      },
                    },
                  },
                },
              });
            }}
          >
            {!followLoading && "Follow"}
          </Button>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <UnfollowModal data={followed} />
      </Modal>
    </>
  );
}

export default FollowingModal;
