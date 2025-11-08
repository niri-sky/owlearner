// icon images for features section
import Message from "@/shared/assets/img/message.png";
import Madel from "@/shared/assets/img/medal.png";
import Pot from "@/shared/assets/img/pot.png";
// svg icon for professional section
import Mobile from "@/shared/assets/svg/mobile.svg";
import Info from "@/shared/assets/svg/info.svg";
import Tick from "@/shared/assets/svg/tick.svg";
// svg icon for contact us page
import PhoneIcon from "@/shared/assets/svg/contact-phone.svg";
import EmailIcon from "@/shared/assets/svg/contact-email.svg";
import LocationIcon from "@/shared/assets/svg/contact-location.svg";
// icon images for resources section
import Slide_1 from "@/shared/assets/img/slide-1.png";
import Slide_2 from "@/shared/assets/img/slide-2.png";
import Slide_3 from "@/shared/assets/img/slide-3.png";
import Slide_4 from "@/shared/assets/img/slide-4.png";
// icon images for resources section
import MobileDesign from "@/shared/assets/img/mobile.png";
import Development from "@/shared/assets/img/development.png";
import Illustration from "@/shared/assets/img/illustration.png";

// student review section data
import student from "@/shared/assets/img/review.png";
import student1 from "@/shared/assets/img/person1.jpg";
import student2 from "@/shared/assets/img/person2.jpg";
import student3 from "@/shared/assets/img/person3.jpg";

// global
export const APP_LOGO = "/logo.svg";
export const APP_NAME = "Owl Learner";

// features section datas
export const featuresData: any[] = [
  {
    iconImg: Message,
    heading: "Complete control",
    desc: "Choose from many topics, skill levels, and languages. Learn at your pace an schedule",
  },
  {
    iconImg: Madel,
    heading: "Built by expert",
    desc: "Highly qualified on-demand online courses created by real-world experts. Hone your skills with practical knowledge",
  },
  {
    iconImg: Pot,
    heading: "Better learning outcome ",
    desc: "Invest in your career or advance your skills by learning from experts in the field",
  },
];

// professional section datas
export const professionalData: any[] = [
  {
    iconImg: Mobile,
    heading: "No apps needed",
    desc: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod",
  },
  {
    iconImg: Tick,
    heading: "Always work",
    desc: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod",
  },
  {
    iconImg: Info,
    heading: "Change info any time",
    desc: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod",
  },
];
// resources section datas
export const resourcesData: any[] = [
  {
    slideImg: Slide_1,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_2,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_3,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_4,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_1,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_3,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
  {
    slideImg: Slide_1,
    title: "UIUX design",
    heading: "Featured Customer: Reliablesoft",
    dates: "December 25,2023",
    comments: "02 comments",
  },
];
// topics section datas
export const topicsData: any[] = [
  {
    topicIcon: Illustration,
    title: "Motion Graphic",
    desc: "2d / 3d video animation in a short period of time designed to promote a company product",
    backgroundColor: "#2FC89B",
  },
  {
    topicIcon: MobileDesign,
    title: "Mobile Design",
    desc: "Make the appearance of a mobile application that has quality and increases user convenience",
    backgroundColor: "#FF81AF",
  },
  {
    topicIcon: Development,
    title: "Development",
    desc: "Change the appearance of a design into code that will be made into an amazing website",
    backgroundColor: "#FD440F",
  },
  {
    topicIcon: Illustration,
    title: "Illustration",
    desc: "Create customizable illustrations with attractive designs that are made visually through high creativity",
    backgroundColor: "#3371F2",
  },
];

// student reviews data
export const studenReviewsData: StudentReviewsDataTypes[] = [
  {
    name: "Yunus seyhan",
    image: student,
    designation: "Web designer",
    rating: 5,
    reviews:
      "The ideal tool for achieving our motto of Service with Passion. SaaSup has earned our trust and awe from the very beginning. People frequently tell us how much they appreciate the dialogue and believe it's hip, which is what they would expect from a business.The ability to make secure and quick international The organisation that takes its growth seriously.",
  },
  {
    name: "Bryan Daen",
    image: student2,
    designation: "Web designer",
    rating: 4.5,
    reviews:
      "As a student who recently completed the data science course offered by Owl Learner, I find myself both well-equipped with knowledge and thoroughly satisfied with the experience. The course, designed to provide a comprehensive understanding of the full cycle Data Science went above and beyond my expectations.",
  },
  {
    name: "Michael Jack",
    image: student1,
    designation: "Web Developer",
    rating: 4,
    reviews:
      "The curriculum of the course I took was thoughtfully structured, with each module building upon the last to ensure a cohesive learning journey. Initially, I found the course challenging, but thanks to the resources provided, and the support from the instructor, I was able to grasp the concepts more readily than anticipated.",
  },
  {
    name: "Mikhail Tal",
    image: student3,
    designation: "Web Developer",
    rating: 5,
    reviews:
      "One aspect that particularly stood out at Owl Learner was the combination of theoretical instruction with practical application. The weekly assignments were not just busywork but actually enhanced my understanding of the course material. Hands-on projects, allowed me to apply what I learned in a real-world context, which was incredibly rewarding and offered a taste of what to expect in the professional world.",
  },
];
// contact us page datas
export const contactUsData: contactUsDataTypes[] = [
  {
    Icon: PhoneIcon,
    title: "+00(123)345 543 23",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisc elit.Phasellus aliquet urna  libero ut.",
  },
  {
    Icon: EmailIcon,
    title: "Rainer@gmail.com",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisc elit.Phasellus aliquet urna  libero ut.",
  },
  {
    Icon: LocationIcon,
    title: "12 Poving st..Rnu 3542",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisc elit.Phasellus aliquet urna  libero ut.",
  },
];
