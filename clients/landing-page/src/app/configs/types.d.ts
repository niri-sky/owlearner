// type Component = () => JSX.Element | any | Promise<JSX.Element>;

// section title types
type SectionTitleTypes = {
  title: string;
  desc?: string;
  txtColor?: string;
};

// features section data types
type featureDataTypes = {
  iconImg: string | StaticImageData;
  heading: string;
  desc: string;
};

interface FollowingUser {
  id: string;
  name: string;
  type: string;
  email: string;
  username: string;
  profile: any;
  userId: string;
  followers: any[];
}

// professional section data types
type professionalDataTypes = {
  iconImg: string | StaticImageData;
  heading: string;
  desc: string;
};

// student review section data types
type StudentReviewsDataTypes = {
  name: string;
  image: string | StaticImageData;
  reviews: string | any;
  rating: number | string;
  designation: string;
};

// resources section data types
type resourcesDataTypes = {
  slideImg: string | StaticImageData;
  title: string;
  heading: string;
  dates?: string;
  comments: string;
};
// topics section data types
type topicDataTypes = {
  topicIcon: string | StaticImageData;
  title: string;
  desc: string;
  backgroundColor: string;
};
// contact us page data types
type contactUsDataTypes = {
  Icon: string | StaticImageData;
  title: string;
  desc: string;
};

type LeaderBoardUserTypes = {
  id: string | number;
  name: string;
  avatar: string;
  rank: number;
  obtainedQuizMark: number;
  totalPositionNo: number;
};

type LeaderBoardColumnsTypes = {
  name: string;
  uid: string | number | any;
};

// single comment types
type SingleCommentTypes = {
  name: string;
  img: string;
  postTime?: string;
  comment?: string;
};
// profile course data types
type ProfileCourseDataTypes = {
  courseImg: string;
  courseTitle: string;
  userName: string;
  oldPrice: string;
  updatePrice: string;
};

type ProfileData = {
  id: string | number;
  name: string;
  email: string;
  username: string;
  profile?: string;
  nickName?: string;
  joinedAt: string;
  gender?: string;
  cover?: string;
  biography?: string;
  followers: FollowersType[];
  birthDate?: string;
  links?: any[];
  courses?: StudentCourse[];
};

// latest courses data types
type LatestCoursesDataTypes = {
  latestCourseImg: string;
  latestCourseTitle: string;
};

// followers user data type
type FollowersUserDataType = {
  userImg: string;
  userName: string;
  name: string;
  userId: string | number;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  profile: any;
  joinedAt: string;
};

type CourseData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  demo_file: string;
  estimated_price: number;
  price: number;
  duration: string;
  level: string;
  language: string;
  popular_topics: string;
  course_category: string;
  course_subcategory: string;
  course_requirements: string[];
  subtitle_language: string;
  course_tags: string;
  thumbnail: string;
  what_you_will_learn: string[];
  createdAt: string;
  status: string;
  section: Section[];
  teacher: Teacher;
  reviews: CourseReview[];
  studentCourse: StudentCourse[];
  createdAt: string;
  updatedAt: string;
};

type StudentCourse = {
  id: string;
  certificate?: string;
  status: string;
  course: CourseData;
  quiz_points: StudentQuizPoint[];
  assignment_points: StudentAssignmentPoint[];
  student: Student;
  courseId: string;
  studentId: string;

  completedAt?: string;

  createdAt: string;
  updatedAt: string;
};

type StudentAssignmentPoint = {
  id: string;
  mark: number;
  intime: boolean;
};

type StudentQuizPoint = {
  id: string;
  points: number;
  correct: number;
  total_quiz: number;
  studentCourseId: number;
  courseContentId: number;
};

type CourseReview = {
  id: string;
  rating: number;
  text: string;
  studentCourse: StudentCourse;
  createdAt: string;
};

type Section = {
  id: string;
  section_name: string;
  content: Content[];
};

type Content = {
  id: string;
  video_title: string;
  video_description: string;
  video_duration?: number;
  file: string;
  links: Link[];
  quizzes: Quiz[];
  questions: CourseQuestion[];
  resources: CourseResource[];
  studentQuizPoint: StudentQuizPoint[];
};

type CourseResource = {
  name: string;
  src: string;
};

type CourseQuestion = {
  id: string;
  question: string;
  answer: string;
  studentCourse: StudentCourse;
  createdAt: string;
  updatedAt: string;
};

type Link = {
  id: string;
  title: string;
  link: string;
};

type Quiz = {
  id: string;
  title: string;
  answer: string;
  options: string[];
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  profile?: string;
  organization: Organization;
  biography?: string;
  title?: string;
  courses: CourseData[];
  teacherEarning: TeacherEarning;
};

type TeacherEarning = {
  id: string;
  earn: number;
  withdraw: number;
  sales: any[];
};
type OrganizationEarning = {
  id: string;
  earn: number;
  withdraw: number;
  sales: any[];
};

type Organization = {
  id: string;
  name: string;
  email: string;
  profile?: string;
  organizationEarning: OrganizationEarning;
};
type Student = {
  id: string;
  name: string;
  email: string;
  profile?: string;
};

// post data types
type PostDataTypes = {
  id: string | number;
  text: string;
  img?: string;
  policy: string;
  likes?: PostLikeType[];
  userType: string;
  comments?: CommentType[];
  createdAt: string;
  updatedAt: string;
  organizationId?: number | string;
  organization?: TeacherOrganization;
  teacherId?: number | string;
  teacher?: TeacherOrganization;
};

type PostLikeType = {
  id: string | number;
  userType: string;
  postId: number | string;
  organizationId?: number | string;
  teacherId?: number | string;
  studentId?: number | string;
};

type CommentType = {
  id: string | number;
  img?: string;
  message: string;
  userType: string;
  organizationId?: number | string;
  organization?: TeacherOrganization;
  teacherId?: number | string;
  teacher?: TeacherOrganization;
  studentId?: number | string;
  student?: TeacherOrganization;
  createdAt: string;
  updatedAt: string;
  replies?: CommentType[];
};

type TeacherOrganization = {
  id: string;
  name: string;
  email: string;
  profile: any;
  status: string;
  joinedAt: string;
};

// manage team page data types
type ManageTeamDataTypes = {
  id: string | number;
  name: string;
  role: string;
  joined_at: string | Date;
  avatar: string;
  email: string;
};
// single comment types
type SingleCommentTypes = {
  name: string;
  img: string;
  postTime?: string;
  comment?: string;
};

type FollowersType = {
  student: ProfileData;
};

// profile course data types
type ProfileCourseDataTypes = {
  courseImg: string;
  courseTitle: string;
  userName: string;
  oldPrice: string;
  updatePrice: string;
};

type PostDataTypes = {
  id: string | number;
  text: string;
  img?: string;
  policy: string;
  likes?: PostLikeType[];
  userType: string;
  comments?: CommentType[];
  createdAt: string;
  updatedAt: string;
  organizationId?: number | string;
  organization?: TeacherOrganization;
  teacherId?: number | string;
  teacher?: TeacherOrganization;
};

// latest courses data types
type LatestCoursesDataTypes = {
  latestCourseImg: string;
  latestCourseTitle: string;
};
// followers user data type
type FollowersUserDataType = {
  userImg: string;
  userName: string;
  name: string;
  userId: string | number;
};
