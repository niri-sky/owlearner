"use client";
// global package
import ReactPlayer from "react-player";

// custom file imports
import SectionTitle from "@/shared/components/section-title";

const Professional = () => {
  return (
    <section className="xl:pt-[110px] lg:pt-[60px] md:pt-[40px] pt-8 w-full bg-white relative z-20">
      <div className="container">
        <div className="w-full flex flex-col lg:gap-[56px] md:gap-[40px] gap-6">
          <div>
            <SectionTitle
              title="Learn how Owl Learner can help you grow"
              desc="Join our community of students and instructors today. Learn from experts with hands-on projects and real-life examples. Advance your skills or gain new ones."
            />
          </div>

          {/* bottom */}
          <div className="w-full flex xl:gap-[100px] lg:gap-[80px] md:gap-[60px] gap-6 flex-col">
            <div className="rounded-[12px] md:h-[700px] h-[228px] w-full">
              <ReactPlayer
                controls={true}
                width={"100%"}
                height={"100%"}
                url="https://www.youtube.com/embed/SKwJ9eEDVnA"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute md:bottom-[-40px] bottom-[-20px] lg:h-[690px] md:h-[650px] h-[268px] w-full left-0 bg-primary -z-10 clip-path-custom"></div>
    </section>
  );
};

export default Professional;
