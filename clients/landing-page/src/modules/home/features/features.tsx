import Image from "next/image";
// custom file imports
import FeatureElement from "../elements/featureElement";
import { featuresData } from "@/app/configs/constants";
import FeaturesImg from "@/shared/assets/img/features_section.jpg";
import Button from "@/shared/components/button";

const Features = () => {
  return (
    <section className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-white">
      <div className="container">
        <div className="w-full flex items-start lg:flex-row flex-col xl:gap-[68px] lg:gap-8 gap-[40px]">
          <div className="w-full md:order-1 order-2">
            <Image
              width={592}
              height={584}
              className="mx-auto"
              src={FeaturesImg}
              alt="Feature image"
            />
          </div>
          <div className="w-full md:order-2 order-1">
            <div className="flex flex-col">
              {featuresData.map(
                ({ desc, heading, iconImg }: featureDataTypes, i: number) => (
                  <FeatureElement
                    key={i}
                    iconImg={iconImg}
                    heading={heading}
                    desc={desc}
                  />
                )
              )}

              <div className="mt-6 ml-[40px]">
                <Button
                  title="See all features"
                  className="py-4 px-8 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
