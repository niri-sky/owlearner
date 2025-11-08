import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { CourseContentUpdateInput } from 'src/graphql/@generated/course-content/course-content-update.input';
import { CourseCreateInput } from 'src/graphql/@generated/course/course-create.input';
import { CourseUpdateInput } from 'src/graphql/@generated/course/course-update.input';
import { CourseWhereInput } from 'src/graphql/@generated/course/course-where.input';
import { StudentCourseUpdateInput } from 'src/graphql/@generated/student-course/student-course-update.input';
import { StudentCourseWhereInput } from 'src/graphql/@generated/student-course/student-course-where.input';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createCourseInput: CourseCreateInput) {
    const course = await this.databaseService.course.create({
      data: createCourseInput as any,
      include: {
        section: true,
        teacher: {
          include: {
            organization: true,
          },
        },
      },
    });

    this.notificationService.createNotificationForAdmin({
      link: '/courses',
      text: 'created a course.',
      sender: {
        create: {
          type: 'sender',
          userType: 'teacher',
          teacher: {
            connect: {
              id: Number(course.teacher.id),
            },
          },
        },
      },
    });

    if (course?.teacher?.organization) {
      this.notificationService.create({
        link: '/courses',
        text: 'created a course.',
        receiver: {
          create: {
            type: 'receiver',
            userType: 'organization',
            organization: {
              connect: {
                id: Number(course?.teacher?.organization?.id),
              },
            },
          },
        },
        sender: {
          create: {
            type: 'sender',
            userType: 'teacher',
            teacher: {
              connect: {
                id: Number(course.teacher.id),
              },
            },
          },
        },
      });
    }

    return course;
  }

  async findAll(where: CourseWhereInput) {
    const courses = await this.databaseService.course.findMany({
      where: where as any,
      include: {
        invoices: true,
        section: {
          include: {
            content: {
              include: {
                links: true,
                quizzes: true,
              },
            },
          },
        },
        teacher: {
          include: {
            organization: {
              include: {
                organizationEarning: true,
              },
            },
            teacherEarning: true,
          },
        },
        reviews: true,
        studentCourse: true,
      },
    });
    return courses;
  }

  async findActiveCourses() {
    const courses = await this.databaseService.course.findMany({
      where: { status: 'live' },
    });
    return courses;
  }

  async findOne(slug: string) {
    const course = await this.databaseService.course.findUnique({
      where: { slug },
      include: {
        invoices: true,
        section: {
          include: {
            content: {
              include: {
                links: true,
                quizzes: true,
                studentQuizPoint: true,
                questions: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  include: {
                    studentCourse: {
                      include: {
                        student: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        studentCourse: true,
        teacher: {
          include: {
            organization: {
              include: {
                organizationEarning: true,
              },
            },
            courses: { include: { reviews: true, studentCourse: true } },
            teacherEarning: true,
          },
        },

        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            studentCourse: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    return course;
  }

  async update(id: number, updateCourseInput: CourseUpdateInput) {
    const course = await this.databaseService.course.update({
      where: { id },
      data: updateCourseInput as any,
      include: {
        teacher: {
          include: {
            organization: true,
          },
        },
      },
    });

    return course;
  }

  async updateContent(id: number, input: CourseContentUpdateInput) {
    const courseContent = await this.databaseService.courseContent.update({
      where: { id },
      data: input as any,
    });

    return courseContent;
  }
  async updateStudentCourse(id: number, input: StudentCourseUpdateInput) {
    const studentCourse = await this.databaseService.studentCourse.update({
      where: { id },
      data: input as any,
    });

    return studentCourse;
  }

  async findStudentCourse(where: StudentCourseWhereInput) {
    const studentCourse = await this.databaseService.studentCourse.findFirst({
      where: where as any,
    });
    return studentCourse;
  }

  async remove(id: number) {
    const course = await this.databaseService.course.delete({ where: { id } });
    return course;
  }
}
