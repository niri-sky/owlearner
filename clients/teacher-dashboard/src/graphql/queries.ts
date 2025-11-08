import { gql } from "@apollo/client";

export const ADMINS_QUERY = gql`
  query Admins {
    admins {
      id
      name
      email
      profile
      role
      joinedAt
      status
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

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminCreateInput!) {
    createAdmin(CreateAdminInput: $input) {
      id
      name
      email
    }
  }
`;

export const PAYMENT_INVOICES_QUERY = gql`
  query GetPaymentInvoices($where: PaymentInvoiceWhereInput) {
    paymentInvoices(where: $where) {
      id
      userType
      amount
      status
      requestDate
      bankDetails
      status
      to
      organizationId
      teacherId
      teacher {
        id
        name
        email
        profile
      }
      organization {
        id
        name
        email
        profile
      }
    }
  }
`;

export const TEACHER_WITHDRAW_REQUEST = gql`
  mutation RequestWithdraw($input: WithdrawRequestInput!) {
    requestTeacherWithdraw(input: $input) {
      status
    }
  }
`;
export const ORGANIZATION_WITHDRAW_REQUEST = gql`
  mutation RequestWithdraw($input: WithdrawRequestInput!) {
    requestOrganizationWithdraw(input: $input) {
      status
    }
  }
`;

export const NOTIFICATIONS_QUERY = gql`
  query GetNotifications($where: NotificationWhereInput) {
    notifications(where: $where) {
      id
      text
      createdAt
      isViewed
      link
      sender {
        id
        userType
        type
        admin {
          id
          name
          email
          profile
        }
        student {
          id
          name
          email
          profile
        }
        teacher {
          id
          name
          email
          profile
        }
        organization {
          id
          name
          email
          profile
        }
      }
      receiver {
        id
        userType
        type
        admin {
          id
          name
          email
          profile
        }
        student {
          id
          name
          email
          profile
        }
        teacher {
          id
          name
          email
          profile
        }
        organization {
          id
          name
          email
          profile
        }
      }
    }
  }
`;

export const TOP_STUDENTS_QUERY = gql`
  query GetTopStudents($where: StudentWhereInput) {
    topStudents(where: $where) {
      id
      name
      email
      profile
      joinedAt
      courseSales {
        id
      }
    }
  }
`;

export const SALES_QUERY = gql`
  query GetSales {
    sales {
      id
      price
      createdAt
      student {
        id
        name
        email
        profile
      }
      teacherEarning {
        id
      }
      course {
        id
        title
        price
      }
    }
  }
`;

export const TEACHER_EARNING = gql`
  query GetTeacherEarning($teacherId: Int!) {
    teacherEarning(teacherId: $teacherId) {
      id
      earn
      withdraw
      sales {
        id
        price
        createdAt
      }
      paymentInvoices {
        id
        amount
        requestDate
        userType
      }
    }
  }
`;

export const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription OnNotificationAdded($where: NotificationFilterInput) {
    notificationCreated(where: $where) {
      id
      text
      createdAt
      isViewed
      sender {
        id
        userType
        type
        admin {
          id
          name
          email
          profile
        }
        student {
          id
          name
          email
          profile
        }
        teacher {
          id
          name
          email
          profile
        }
        organization {
          id
          name
          email
          profile
        }
      }
      receiver {
        id
        userType
        type
        admin {
          id
          name
          email
          profile
        }
        student {
          id
          name
          email
          profile
        }
        teacher {
          id
          name
          email
          profile
        }
        organization {
          id
          name
          email
          profile
        }
      }
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

export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id: Int!, $input: NotificationUpdateInput!) {
    updateNotification(id: $id, updateNotificationInput: $input) {
      id
    }
  }
`;

export const INVOICES_QUERY = gql`
  query Invoices($where: InvoiceWhereInput) {
    invoices(where: $where) {
      id
      orderedAt
      price
      student {
        id
        name
        email
        profile
      }
      courses {
        id
        title
        price
        estimated_price
        createdAt
      }
      coupon {
        id
        code
        discount
        type
        createdAt
      }
    }
  }
`;

export const INVITE_ADMIN = gql`
  mutation InviteAdmin($input: AdminCreateInput!) {
    inviteAdmin(CreateAdminInput: $input) {
      id
      name
      email
    }
  }
`;
export const ACCEPT_INVITE_ADMIN = gql`
  mutation AcceptInviteAdmin($token: String!, $input: PasswordInput!) {
    acceptInviteAdmin(Token: $token, Passwords: $input) {
      id
      name
      email
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($id: Int!) {
    removeAdmin(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation UpdateAdmin($id: Int!, $input: AdminUpdateInput!) {
    updateAdmin(id: $id, UpdateAdminInput: $input) {
      id
      name
    }
  }
`;

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdminProfile($id: Int!, $input: UpdateAdminProfileInput!) {
    updateAdminProfile(id: $id, AdminProfileInput: $input) {
      id
      name
      email
      profile
      role
      joinedAt
    }
  }
`;

export const TODOS_QUERY = gql`
  query GetTodos($adminId: Int!) {
    todos(AdminId: $adminId) {
      id
      title
      note
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($input: TodoCreateInput!) {
    createTodo(CreateTodoInput: $input) {
      id
    }
  }
`;
export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $input: TodoUpdateInput!) {
    updateTodo(id: $id, UpdateTodoInput: $input) {
      id
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
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

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: Int!, $input: TicketUpdateInput!) {
    updateTicket(id: $id, updateTicketInput: $input) {
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

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: Int!) {
    removeTeacher(id: $id) {
      id
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

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: Int!) {
    removeOrganization(id: $id) {
      id
    }
  }
`;

export const INVITE_ORGANIZATION = gql`
  mutation InviteOrganization($input: OrganizationCreateInput!) {
    inviteOrganization(createOrganizationInput: $input) {
      id
      name
      email
    }
  }
`;
export const ACCEPT_INVITE_ORGANIZATION = gql`
  mutation AcceptInviteAdmin($token: String!, $input: PasswordInput!) {
    acceptInviteAdmin(Token: $token, Passwords: $input) {
      id
      name
      email
    }
  }
`;

export const TEACHER_SIGNUP = gql`
  mutation SignupTeacher($input: SignupInput!, $organization: Int) {
    signupTeacher(signupInput: $input, organization: $organization) {
      token
      status
    }
  }
`;

export const TEACHER_VERIFY = gql`
  mutation VerifyTeacher($input: VerifyInput!) {
    verifyTeacher(verifyInput: $input) {
      id
    }
  }
`;

export const RESET_TEACHER_PASSWORD = gql`
  mutation ResetPasswordRequest($input: EmailInput!) {
    resetTeacherPassword(emailInput: $input) {
      id
    }
  }
`;

export const CHANGE_TEACHER_PASSWORD = gql`
  mutation ChangeTeacherPassword($token: String!, $input: PasswordInput!) {
    changeTeacherPassword(token: $token, passwords: $input) {
      id
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseCreateInput!) {
    createCourse(createCourseInput: $input) {
      id
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

export const TEACHER_COURSES_QUERY = gql`
  query ($input: CourseWhereInput) {
    courses(where: $input) {
      id
      title
      price
      slug
      estimated_price
      status
      createdAt
      invoices {
        id
      }
    }
  }
`;

export const MUX_UPLOAD_URL = gql`
  query {
    muxUploadUrl {
      url
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon($input: CouponCreateInput!) {
    createCoupon(createCouponInput: $input) {
      id
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

export const COUPONS_QUERY = gql`
  query GetCoupons($where: CouponWhereInput) {
    coupons(where: $where) {
      id
      name
      code
      discount
      type
      createdAt
      couponUsed {
        id
      }
      course {
        id
        title
      }
    }
  }
`;

export const UPDATE_TEACHER = gql`
  mutation UpdateTeacher($id: Int!, $input: TeacherUpdateInput!) {
    updateTeacher(id: $id, updateTeacherInput: $input) {
      id
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: Int!) {
    removeCoupon(id: $id) {
      id
    }
  }
`;

export const RESEND_TEACHER_VERIFY = gql`
  mutation ResendEmail($token: String!) {
    resendTeacherVerify(token: $token) {
      token
    }
  }
`;

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

export const UPDATE_TEACHER_PASSWORD = gql`
  mutation UpdateTeacherPassword($id: Int!, $input: ChangePasswordInput!) {
    updateTeacherPassword(id: $id, input: $input) {
      id
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
