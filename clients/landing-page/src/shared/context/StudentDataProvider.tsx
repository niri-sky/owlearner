"use client";
import { ReactNode, createContext, useContext } from "react";
import useUserData from "../hooks/useUserData";
import { useMutation, useQuery } from "@apollo/client";
import { SINGLE_STUDENT_QUERY, UPDATE_STUDENT } from "@/graphql/queries";
import { signOut } from "next-auth/react";

type ProviderData = {
  profileData: ProfileData;
  updateStudent: (d: any) => Promise<void>;
};

const StudentDataContext = createContext({} as ProviderData);

type Props = {
  children: ReactNode;
};

function StudentDataProvider({ children }: Props) {
  const { userData } = useUserData();

  const { data: studentData } = useQuery(SINGLE_STUDENT_QUERY, {
    variables: {
      id: Number(userData?.id),
    },
    skip: !userData?.id,
    onCompleted: () => {},
    onError: () => {
      signOut();
    },
  });

  const profileData = studentData?.student;

  const [studentUpdate] = useMutation(UPDATE_STUDENT, {
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

  async function updateStudent(d: any) {
    await studentUpdate({
      variables: {
        id: Number(userData?.id),
        input: d,
      },
    });
  }

  console.log("Student Data", studentData);

  return (
    <StudentDataContext.Provider value={{ profileData, updateStudent }}>
      {children}
    </StudentDataContext.Provider>
  );
}

export const useStudentData = () => useContext(StudentDataContext);

export default StudentDataProvider;
