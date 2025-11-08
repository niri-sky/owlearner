import PublicProfile from "@/modules/public-profile";
import PublicProfileDataProvider from "@/shared/context/PublicProfileProvider";

function PublicProfileView() {
  return (
    <div>
      <PublicProfileDataProvider>
        <PublicProfile />
      </PublicProfileDataProvider>
    </div>
  );
}

export default PublicProfileView;
