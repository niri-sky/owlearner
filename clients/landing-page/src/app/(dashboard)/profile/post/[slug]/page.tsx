import PostDetails from "@/modules/profile/PostDetails";
import ProfileDataProvider from "@/shared/context/ProfileDataProvider";
import React from "react";

function page() {
  return (
    <div>
      <ProfileDataProvider>
        <PostDetails />
      </ProfileDataProvider>
    </div>
  );
}

export default page;
