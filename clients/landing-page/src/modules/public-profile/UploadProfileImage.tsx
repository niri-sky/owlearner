import Image from "next/image";

type Props = {
  profile?: string;
};

function UploadProfileImage({ profile }: Props) {
  const imgSrc =
    profile ||
    "https://modernize-angular-main.netlify.app/assets/images/profile/user-1.jpg";

  return (
    <>
      <div className=" relative group">
        <div className="lg:w-[200px] md:w-[180px] w-[130px] lg:h-[200px] md:h-[180px] h-[130px] rounded-full ">
          <Image
            className="rounded-full lg:w-[200px] md:w-[180px] w-[130px] lg:h-[200px] md:h-[180px] h-[130px] border-2 border-[white]"
            width={200}
            height={200}
            src={imgSrc}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default UploadProfileImage;
