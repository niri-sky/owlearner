import { gql } from "@apollo/client";

export const CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
      updatedAt
      subcategories {
        id
        name
        topics {
          id
          name
        }
      }
    }
  }
`;

export const FOLLOWING_USERS = gql`
  query ($studentId: Int!) {
    followingUsers(studentId: $studentId) {
      email
      name
      type
      profile
      username
      userId
      followers {
        id
        studentId
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($input: FollowingFollowerCreateInput!) {
    followUser(input: $input) {
      id
    }
  }
`;
export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($id: Int!) {
    unfollowUser(id: $id) {
      id
    }
  }
`;

export const TICKETS_QUERY = gql`
  query GetTickets($input: TicketWhereInput) {
    tickets(query: $input) {
      id
      title
      status
      messages {
        id
        message
        admin {
          id
          name
          profile
          email
        }
        teacher {
          id
          name
          profile
          email
        }
        organization {
          id
          name
          profile
          email
        }
        student {
          id
          name
          profile
          email
        }
      }

      type
      teacher {
        id
        name
        profile
        email
      }
      organization {
        id
        name
        profile
        email
      }
      student {
        id
        name
        profile
        email
      }

      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: Int!) {
    removeTicket(id: $id) {
      id
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationCreateInput!) {
    createNotification(createNotificationInput: $input) {
      id
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: Int!, $input: TicketUpdateInput!) {
    updateTicket(id: $id, updateTicketInput: $input) {
      id
    }
  }
`;
export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: Int!, $input: StudentUpdateInput!) {
    updateStudent(id: $id, updateStudentInput: $input) {
      id
    }
  }
`;
export const CREATE_TICKET = gql`
  mutation CreateTicket($input: TicketCreateInput!) {
    createTicket(createTicketInput: $input) {
      id
    }
  }
`;

export const TEACHERS_QUERY = gql`
  query {
    teachers {
      id
      name
      email
      profile
      status
      joinedAt
      organization {
        id
        name
      }
      posts {
        id
      }
      courses {
        id
      }
    }
  }
`;

export const ORGANIZATIONS_QUERY = gql`
  query {
    organizations {
      id
      name
      email
      profile
      status
      joinedAt
      teachers {
        id
        courses {
          id
        }
      }
    }
  }
`;

export const SINGLE_ORGANIZATION_QUERY = gql`
  query GetOrganization($id: Int!) {
    organization(id: $id) {
      id
      name
      email
      profile
      cover

      username
      joinedAt
      teachers {
        id
        courses {
          id
        }
      }
      followers {
        id
        student {
          id
          name
          email
        }
      }
      links {
        type
        link
      }
    }
  }
`;

export const SINGLE_TEACHER_QUERY = gql`
  query GetTeacher($id: Int!) {
    teacher(id: $id) {
      id
      name
      email
      profile
      cover
      title
      nickName
      birthDate
      gender
      biography
      username
      joinedAt
      followers {
        id
        student {
          id
          name
          email
        }
      }
      links {
        type
        link
      }
      courses {
        id
        title
        thumbnail
        estimated_price
        price
        teacher {
          id
          name
          email
        }
      }
    }
  }
`;

export const SINGLE_STUDENT_QUERY = gql`
  query GetStudent($id: Int!) {
    student(id: $id) {
      id
      name
      email
      profile
      cover
      nickName
      birthDate
      gender
      biography
      username
      joinedAt
      courses {
        id
        certificate
        status
        courseId
        createdAt
        completedAt
        quiz_points {
          id
          points
          total_quiz
          correct
        }
        assignment_points {
          id
          mark
          intime
          studentCourseId
        }
        course {
          id
          title
          slug
          thumbnail
          section {
            section_name
            content {
              quizzes {
                id
                title
                answer
                options
              }
            }
          }
          studentCourse {
            student {
              id
              name
              email
              profile
            }
            quiz_points {
              points
              correct
            }
          }
        }
      }
    }
  }
`;

export const ADD_COURSE_TO_STUDENT = gql`
  mutation GetStudentCourse($input: [StudentCourseCreateManyInput!]!) {
    addCoursesToStudent(input: $input) {
      id
    }
  }
`;

export const STUDENT_SIGNUP = gql`
  mutation SignupStudent($input: SignupInput!) {
    signupStudent(signupInput: $input) {
      token
      status
    }
  }
`;

export const STUDENT_VERIFY = gql`
  mutation VerifyStudent($input: VerifyInput!) {
    verifyStudent(verifyInput: $input) {
      id
    }
  }
`;

export const RESET_STUDENT_PASSWORD = gql`
  mutation ResetPasswordRequest($input: EmailInput!) {
    resetStudentPassword(emailInput: $input) {
      id
    }
  }
`;

export const VALIDATE_COUPON = gql`
  mutation ValidateCoupon($coupon: String!) {
    validateCoupon(coupon: $coupon) {
      id
      type
      discount
      code
      name
    }
  }
`;

export const PAYMENT_INTENDS = gql`
  query CreateIntends($price: Float!) {
    createIntends(price: $price) {
      status
      clientSecret
    }
  }
`;

export const CHANGE_STUDENT_PASSWORD = gql`
  mutation ChangeStudentPassword($token: String!, $input: PasswordInput!) {
    changeStudentPassword(token: $token, passwords: $input) {
      id
    }
  }
`;

export const RESEND_STUDENT_VERIFY = gql`
  mutation ResendEmail($token: String!) {
    resendStudentVerify(token: $token) {
      token
    }
  }
`;

export const COURSES_QUERY = gql`
  query GetCourse($where: CourseWhereInput) {
    courses(where: $where) {
      id
      title
      slug
      description
      estimated_price
      price
      duration
      level
      language
      popular_topics
      course_category
      course_subcategory
      course_requirements
      subtitle_language
      course_tags
      thumbnail
      popular_topics
      what_you_will_learn
      createdAt
      updatedAt
      status
      studentCourse {
        id
        studentId
      }
      reviews {
        id
        rating
      }
      teacher {
        id
        name
        email
        teacherEarning {
          id
        }
      }
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($id: Int!, $input: CouponUpdateInput!) {
    updateCoupon(id: $id, updateCouponInput: $input) {
      id
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale($input: CourseSaleCreateInput!) {
    createSale(input: $input) {
      id
    }
  }
`;

export const CREATE_SALES = gql`
  mutation CreateSales($input: [CourseSaleCreateManyInput!]!) {
    createSales(input: $input) {
      status
    }
  }
`;

export const SINGLE_COURSES_QUERY = gql`
  query GetCourse($slug: String!) {
    course(slug: $slug) {
      id
      title
      slug
      description
      demo_file
      estimated_price
      price
      duration
      level
      language
      popular_topics
      course_category
      course_subcategory
      course_requirements
      subtitle_language
      course_tags
      thumbnail
      popular_topics
      what_you_will_learn
      createdAt
      updatedAt
      status
      studentCourse {
        id
        status
        courseId
        studentId
      }
      reviews {
        id
        rating
        text
        createdAt
        studentCourse {
          id
          student {
            id
            name
            email
            profile
          }
        }
      }
      section {
        id
        section_name
        content {
          id
          video_title
          video_description
          video_duration
          file
          links {
            id
            title
            link
          }
          quizzes {
            id
            title
            answer
            options
          }
          studentQuizPoint {
            id
            points
            correct
            total_quiz
            studentCourseId
            courseContentId
          }
          questions {
            id
            question
            answer
            createdAt
            updatedAt
            studentCourse {
              id
              student {
                id
                name
                email
                profile
              }
            }
          }
        }
      }
      teacher {
        id
        name
        email
        profile
        biography
        title
        organization {
          id
          name
          email
          profile
        }
        teacherEarning {
          id
        }
        courses {
          studentCourse {
            id
          }
          reviews {
            id
            rating
          }
        }
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: Int!, $input: CourseUpdateInput!) {
    updateCourse(id: $id, updateCourseInput: $input) {
      id
    }
  }
`;

export const UPDATE_COURSE_CONTENT = gql`
  mutation UpdateCourseContent($id: Int!, $input: CourseContentUpdateInput!) {
    updateCourseContent(id: $id, input: $input) {
      id
    }
  }
`;

export const UPDATE_STUDENT_COURSE = gql`
  mutation UpdateStudentCourse($id: Int!, $input: StudentCourseUpdateInput!) {
    updateStudentCourse(id: $id, input: $input) {
      id
    }
  }
`;
export const GET_STUDENT_COURSE = gql`
  query GetStudentCourse($where: StudentCourseWhereInput!) {
    findStudentCourse(where: $where) {
      id
      courseId
      quiz_points {
        id
        points
        correct
        total_quiz
      }
      status
    }
  }
`;

export const POSTS_QUERY = gql`
  query GetPosts($where: PostWhereInput) {
    posts(where: $where) {
      id
      text
      img
      userType
      policy
      likes {
        id
        userType
        postId
        teacherId
        studentId
        organizationId
      }
      organizationId
      organization {
        id
        name
        profile
      }
      teacherId
      teacher {
        id
        name
        profile
      }
      createdAt
      updatedAt
      comments {
        id
        img
        message
        userType
        updatedAt
        replies {
          id
          img
          message
          userType
          updatedAt
          organizationId
          organization {
            id
            name
            profile
          }
          teacherId
          teacher {
            id
            name
            profile
          }
          studentId
          student {
            id
            name
            profile
          }
        }
        organizationId
        organization {
          id
          name
          profile
        }
        teacherId
        teacher {
          id
          name
          profile
        }
        studentId
        student {
          id
          name
          profile
        }
      }
    }
  }
`;

export const SINGLE_POSTS_QUERY = gql`
  query GetPosts($id: Int!) {
    post(id: $id) {
      id
      text
      img
      userType
      policy
      likes {
        id
        userType
        postId
        teacherId
        studentId
        organizationId
      }
      organizationId
      organization {
        id
        name
        profile
      }
      teacherId
      teacher {
        id
        name
        profile
      }
      createdAt
      updatedAt
      comments {
        id
        img
        message
        userType
        replies {
          id
          img
          message
          userType
          organizationId
          organization {
            id
            name
            profile
          }
          teacherId
          teacher {
            id
            name
            profile
          }
          studentId
          student {
            id
            name
            profile
          }
        }
        organizationId
        organization {
          id
          name
          profile
        }
        teacherId
        teacher {
          id
          name
          profile
        }
        studentId
        student {
          id
          name
          profile
        }
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: PostCreateInput!) {
    createPost(createPostInput: $input) {
      id
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentCreateInput!) {
    createComment(input: $input) {
      id
    }
  }
`;
export const CREATE_LIKE = gql`
  mutation CreateLike($input: PostLikeCreateInput!) {
    createLike(input: $input) {
      id
    }
  }
`;
export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: Int!, $input: CommentUpdateInput!) {
    updateComment(id: $id, input: $input) {
      id
    }
  }
`;
export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`;
export const DELETE_LIKE = gql`
  mutation DeleteLike($where: PostLikeWhereInput!) {
    deleteLike(where: $where) {
      status
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    removePost(id: $id) {
      id
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: PostUpdateInput!) {
    updatePost(id: $id, updatePostInput: $input) {
      id
    }
  }
`;

export const UPDATE_STUDENT_PASSWORD = gql`
  mutation UpdateStudentPassword($id: Int!, $input: ChangePasswordInput!) {
    updateStudentPassword(id: $id, input: $input) {
      id
    }
  }
`;
