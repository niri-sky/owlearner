import Image from "next/image";

type Props = {
  cover?: string;
};

function UploadCoverImage({ cover }: Props) {
  const imgSrc = cover || "/images/cover-image.jpg";

  return (
    <div>
      <div className="w-full h-[225px] group overflow-hidden relative">
        <Image
          className="object-cover w-full h-full 2xl:w-full 2xl:h-full"
          width={1000}
          height={225}
          src={imgSrc}
          alt="Cover image"
        />
      </div>
    </div>
  );
}

export default UploadCoverImage;
