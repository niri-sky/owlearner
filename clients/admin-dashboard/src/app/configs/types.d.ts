type Component = () => JSX.Element | Promise<JSX.Element>;

type NavItemTypes = {
  name: string;
  url: string;
};

type DashboardReportBoxDataTypes = {
  bgColor: string;
  textColor: string;
  Icon: string | Component;
  iconColor: string;
  heading: string;
  count: string;
};

type AnalyticsSales = {
  id: string;
  price: number;
  createdAt: string;
  student: AnalyticsStudent;
  teacherEarning?: AnalyticsTeacherEarning;
  course: AnalyticsCourse;
};

type PaymentInvoiceType = {
  id: string;
  userType: string;
  amount: number;
  requestDate: string;
  bankDetails: string;
  status: string;
  to: string;
  organizationId: any;
  teacherId: number;
  organization: AnalyticsStudent;
  teacher: AnalyticsStudent;
};

type AnalyticsStudent = {
  id: string;
  name: string;
  email: string;
  profile: any;
};

type AnalyticsTeacherEarning = {
  id: string;
  sales: AnalyticsSales[];
};

type AnalyticsCourse = {
  id: string;
  title: string;
  price: number;
};

type InvoiceType = {
  id: string;
  orderedAt: string;
  price: number;
  courses: CourseDataTypes[];
  coupon?: CouponDataTypes;
  student: StudentTypes;
  coupon: CouponDataTypes;
};

type ApprovedTabTypes = {
  id: string | number;
  name: string;
  amounts: string | number;
  bank_details: string;
  status: string;
  request_date: string | Date;
  avatar: string;
  email: string;
};

type CouponDataTypes = {
  id: string | number;
  name: string;
  course: {
    id: string;
    title: string;
  };
  couponUser: any[];
  code: string;

  createdAt: string | Date;
  discount: number;
  type: string;
};
//
type TableHeadDataTypes = {
  name: string;
};
//
type TableBodyDataTypes = {
  name: string;
  role: string;
  team: string;
  avatar: string;
  mark: number;
};
// dashboard page top students data types
type TopStudentTypes = {
  id: string | number;
  name: string;
  email: string;
  profile?: string;
  joinedAt: string | Date;
  courseSales: any[];
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

//
type OrganizationTypes = {
  id: string;
  name: string;
  email: string;
  profile: any;
  status: string;
  joinedAt: string;
  teachers: Teacher[];
};

interface Teacher {
  id: string;
  courses: any[];
}

//
type PendingTypes = {
  id: string | number;
  name: string;
  teachers: number;
  courses: string | number;
  total: string | number;
  join: string | Date;
  avatar: string;
  email: string;
};
// teacher page data types
type TeacherTypes = {
  id: string;
  name: string;
  email: string;
  profile: any;
  status: string;
  joinedAt: string;
  organization: any;
  posts: any[];
  courses: any[];
};
// students page data types
type StudentTypes = {
  id: string;
  name: string;
  email: string;
  profile: any;
  status: string;
  joinedAt: string;
  organization: any;
};
// invoices page=> Organizations tab data types
type OrganizationTabTypes = {
  id: string | number;
  name: string;
  organizations_name: string;
  amounts: string | number;
  bank_details: string;
  status: string;
  request_date: string | Date;
  avatar: string;
  email: string;
};
// invoices page=> students tab data types
type StudentTabTypes = {
  id: string | number;
  name: string;
  organizations_name: string;
  price: string | number;
  course_title: string;
  ordered_at: string | Date;
  avatar: string;
  email: string;
};
// courses page data types
type CourseDataTypes = {
  id: string;
  slug: string;
  title: string;
  price: number;
  estimated_price: number;
  status: string;
  createdAt: string;
  invoices: any[];
  teacher: Teacher2;
};

type CategoryDataType = {
  id: string;
  name: string;
  subcategories: SubCategoryDataType[];
};
type SubCategoryDataType = {
  id: string;
  name: string;
  topics: TopicsDataType[];
};
type TopicsDataType = {
  id: string;
  name: string;
};

type Teacher2 = {
  id: string;
  name: string;
  email: string;
  profile: any;
  organization: {
    id: string;
    name: string;
  } | null;
};
// tickets page data types
type TicketDataTypes = {
  id: string | number;
  name: string;
  title: string;
  type: string;
  created_at: string | Date;
  avatar: string;
  email: string;
};

interface UserData {
  id: string;
  name: string;
  email: string;
  profile: any;
  role: string;
  joinedAt: string;
  todos: any[];
}

interface TicketData {
  id: string;
  title: string;
  status: string;
  messages: Message[];
  type: "teacher" | "student" | "organization";
  teacher: UserProfile;
  organization: UserProfile;
  student: UserProfile;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  message: string;
  admin: UserProfile | null;
  teacher: UserProfile | null;
  organization: UserProfile | null;
  student: UserProfile | null;
}

interface UserProfile {
  id: string;
  name: string;
  profile: any;
  email: string;
}

// manage team page data types
type ManageTeamDataTypes = {
  id: string | number;
  name: string;
  role: string;
  joinedAt: string | Date;
  profile: string;
  email: string;
  status: string;
};
