import Profile from "@/modules/profile";
import ProfileDataProvider from "@/shared/context/ProfileDataProvider";

const Page = () => {
  return (
    <ProfileDataProvider>
      <Profile />
    </ProfileDataProvider>
  );
};

export default Page;
