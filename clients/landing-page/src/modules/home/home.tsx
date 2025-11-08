// custom file imports
import Hero from "./features/hero";
import Features from "./features/features";
import Brands from "./features/brands";
import Topics from "./features/topics";
import Professional from "./features/professional";
import Subscribe from "./features/subscribe";
import Courses from "./features/courses";
import Reviews from "./features/reviews";

const Home = () => {

  return (
    <>
      <Hero />
      <Features />
      <Brands />
      <Courses />
      <Topics />
      <Professional />
      {/* <Resources /> */}
      <Reviews />
      <Subscribe />
    </>
  );
};

export default Home;
