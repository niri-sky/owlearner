import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { DatabaseService } from 'src/configs/database/database.service';
import { TypedEventEmitter } from 'src/configs/event-emitter/event-emitter.class';
import { TokenService } from 'src/configs/token/token.service';
import { FollowingFollowerCreateInput } from 'src/graphql/@generated/following-follower/following-follower-create.input';
import { StudentCourseCreateManyCourseInput } from 'src/graphql/@generated/student-course/student-course-create-many-course.input';
import { StudentCourseCreateManyInput } from 'src/graphql/@generated/student-course/student-course-create-many.input';
import { StudentCourseCreateInput } from 'src/graphql/@generated/student-course/student-course-create.input';
import { StudentCreateInput } from 'src/graphql/@generated/student/student-create.input';
import { StudentUpdateInput } from 'src/graphql/@generated/student/student-update.input';
import { StudentWhereInput } from 'src/graphql/@generated/student/student-where.input';
import { EmailInput } from 'src/graphql/custom/email-input';
import { LoginInput } from 'src/graphql/custom/login-input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { SignupInput } from 'src/graphql/custom/signup-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';

@Injectable()
export class StudentService {
  async changePassword(id: number, input: ChangePasswordInput) {
    const { confirmPassword, currentPassword, newPassword } = input;
    if (newPassword != confirmPassword) {
      throw new NotFoundException('Password not match');
    }
    const findStudent = await this.databaseService.student.findUnique({
      where: { id },
    });
    if (!findStudent) throw new NotFoundException('Teacher not found');

    const matchPassword = await compare(currentPassword, findStudent.password);
    if (!matchPassword) throw new NotFoundException('Invalid current password');

    const password = await hash(newPassword, 10);

    const student = await this.databaseService.student.update({
      where: { id },
      data: {
        password,
      },
    });

    return student;
  }

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async loginStudent(input: LoginInput) {
    const student = await this.databaseService.student.findUnique({
      where: { email: input.email },
    });

    if (!student) throw new NotFoundException('Invalid credentials');

    if (!student.verified) {
      throw new NotFoundException('Account not verified');
    }

    if (student.status === 'banned')
      throw new UnauthorizedException('User has banned by authority');

    const matchPassword = await compare(input.password, student.password);

    if (!matchPassword) throw new NotFoundException('Invalid credentials');

    return student;
  }

  async signupStudent(signupInput: SignupInput) {
    const findStudent = await this.databaseService.student.findUnique({
      where: { email: signupInput.email },
    });
    const findTeacher = await this.databaseService.teacher.findUnique({
      where: { email: signupInput.email },
    });
    const findAdmin = await this.databaseService.admin.findUnique({
      where: { email: signupInput.email },
    });
    const findOrganization = await this.databaseService.organization.findUnique(
      { where: { email: signupInput.email } },
    );

    if (findStudent || findTeacher || findAdmin || findOrganization)
      throw new NotFoundException('User already exist');

    signupInput.password = await hash(signupInput.password, 10);

    const username = this.tokenService.generateUsername(signupInput.name);

    const student = await this.databaseService.student.create({
      data: { ...signupInput, username },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({ code, email: student.email });

    const token = await this.tokenService.generate(encrypted);

    this.eventEmitter.emit('email.verify', {
      email: student.email,
      name: student.name,
      code,
    });

    return { status: 'success', token };
  }

  async verifyStudent(verifyInput: VerifyInput) {
    const hash = await this.tokenService.validate(verifyInput.token);

    const data = this.tokenService.decrypt(hash);

    if (verifyInput.email !== data.email || verifyInput.code !== data.code) {
      console.log(verifyInput, data);
      throw new NotFoundException('Invalid code');
    }

    const student = await this.databaseService.student.update({
      where: { email: verifyInput.email },
      data: { verified: true },
    });

    await this.tokenService.delete(verifyInput.token);

    return student;
  }

  async resendVerifyEmail(t: string) {
    const token = await this.tokenService.validateAndGet(t);
    const data = this.tokenService.decrypt(token.data);

    const student = await this.databaseService.student.findUnique({
      where: { email: data.email },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({ code, email: student.email });

    await this.tokenService.update(t, { data: encrypted });

    this.eventEmitter.emit('email.verify', {
      email: student.email,
      name: student.name,
      code,
    });

    return { status: 'success', token: token.token };
  }

  async resetStudentPassword(input: EmailInput) {
    const student = await this.databaseService.student.findUnique({
      where: { email: input.email },
    });

    if (!student.verified) throw new NotFoundException('Account not verified');

    if (!student) throw new NotFoundException('Teacher not found');

    const hash = this.tokenService.encrypt({
      email: student.email,
      type: 'reset_password',
    });

    const token = await this.tokenService.generate(hash);

    const link = process.env.USER_CLIENT_URL + '/auth/password/change/' + token;

    this.eventEmitter.emit('password.request', {
      name: student.name,
      email: student.email,
      link,
    });

    return student;
  }

  async changeStudentPassword(t: string, passwords: PasswordInput) {
    const hashData = await this.tokenService.validate(t);
    const data = this.tokenService.decrypt(hashData);
    if (!data || !data.email)
      throw new NotFoundException('Something went wrong');

    const hashPassword = await hash(passwords.password, 10);
    const student = await this.databaseService.student.update({
      where: { email: data.email },
      data: { password: hashPassword },
    });

    if (!student) throw new NotFoundException('Student not found');

    await this.tokenService.delete(t);

    return student;
  }

  async create(createStudentInput: StudentCreateInput) {
    const student = await this.databaseService.student.create({
      data: createStudentInput as any,
    });

    return student;
  }

  async findAll() {
    const students = await this.databaseService.student.findMany();
    return students;
  }

  async findTopStudents(where: StudentWhereInput) {
    const students = await this.databaseService.student.findMany({
      where: where as any,
      orderBy: {
        courseSales: {
          _count: 'desc',
        },
      },
      include: {
        courseSales: true,
      },
    });
    return students;
  }

  async findOne(id: number) {
    const student = await this.databaseService.student.findUnique({
      where: { id },
      include: {
        following: {
          include: {
            organization: true,
            student: true,
          },
        },
        courses: {
          include: {
            course: {
              include: {
                section: {
                  include: {
                    content: {
                      include: {
                        quizzes: true,
                      },
                    },
                  },
                },
                studentCourse: {
                  include: {
                    student: true,
                    quiz_points: true,
                  },
                },
              },
            },
            assignment_points: true,
            quiz_points: true,
          },
        },
      },
    });
    console.log(id, student);
    return student;
  }

  async findOneWithEmail(email: string) {
    const student = await this.databaseService.student.findUnique({
      where: { email },
    });
    return student;
  }

  async update(id: number, updateStudentInput: StudentUpdateInput) {
    const student = await this.databaseService.student.update({
      where: { id },
      data: Object.assign(
        { ...updateStudentInput },
        updateStudentInput.links && {
          links: {
            deleteMany: {},
            create: updateStudentInput.links.create,
          },
        },
      ) as any,
    });

    if (updateStudentInput.status == 'banned') {
      this.eventEmitter.emit('student.banned', {
        email: student.email,
        name: student.name,
      });
    }

    if (updateStudentInput.status == 'active') {
      const link = process.env.StUDENT_CLIENT_URL + '/signin';
      this.eventEmitter.emit('student.unbanned', {
        email: student.email,
        name: student.name,
        link,
      });
    }
    return student;
  }

  async addCourse(input: StudentCourseCreateManyInput[]) {
    const studentCourse = await this.databaseService.studentCourse.createMany({
      data: input as any,
    });

    return studentCourse;
  }

  async remove(id: number) {
    const student = await this.databaseService.student.delete({
      where: { id },
    });
    return student;
  }

  async getFollowingUsers(studentId: number) {
    const teachers = await this.databaseService.teacher.findMany({
      include: {
        followers: true,
      },
    });
    const organizations = await this.databaseService.organization.findMany({
      include: {
        followers: true,
      },
    });

    let allUsers: any[] = teachers.map((v) => ({
      ...v,
      type: 'teacher',
      userId: v.id.toString(),
    }));

    allUsers = allUsers.concat(
      organizations.map((v) => ({
        ...v,
        type: 'organization',
        userId: v.id.toString(),
      })),
    );

    return allUsers;
  }

  async followUser(input: FollowingFollowerCreateInput) {
    const followingFollower =
      await this.databaseService.followingFollower.create({
        data: input as any,
      });

    return followingFollower;
  }
  async unfollowUser(id: number) {
    const followingFollower =
      await this.databaseService.followingFollower.delete({
        where: { id },
      });

    return followingFollower;
  }
}
