export type CourseDataType = {
  slug: string;
  thumbnail: string;
  title: string;
  description: string;
  what_you_will_learn: string[];
  course_requirements: string[];
  price: number;
  estimated_price: number;
  duration: string;
  level: string;
  language: string;
  subtitle_language: string;
  course_category: string;
  course_tags: string;
  section: SectionDataType[];
};

export type SectionDataType = {
  section_name: string;
  content: VideoContentType[];
};

export type QuizItemType = {
  title: string;
  options: any[];
  answer: number;
};

export type VideoContentType = {
  video_title: string;
  quizzes?: QuizItemType[];
};
