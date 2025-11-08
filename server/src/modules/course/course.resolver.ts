import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from 'src/graphql/@generated/course/course.model';
import { CourseCreateInput } from 'src/graphql/@generated/course/course-create.input';
import { CourseUpdateInput } from 'src/graphql/@generated/course/course-update.input';
import { CourseWhereInput } from 'src/graphql/@generated/course/course-where.input';
import { CourseContentUpdateInput } from 'src/graphql/@generated/course-content/course-content-update.input';
import { CourseContent } from 'src/graphql/@generated/course-content/course-content.model';
import { StudentCourse } from 'src/graphql/@generated/student-course/student-course.model';
import { StudentCourseUpdateInput } from 'src/graphql/@generated/student-course/student-course-update.input';
import { StudentCourseWhereInput } from 'src/graphql/@generated/student-course/student-course-where.input';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  createCourse(
    @Args('createCourseInput') createCourseInput: CourseCreateInput,
  ) {
    return this.courseService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  findAll(@Args('where', { nullable: true }) where: CourseWhereInput) {
    return this.courseService.findAll(where);
  }

  @Query(() => [Course], { name: 'activeCourses' })
  findActiveCourses() {
    return this.courseService.findActiveCourses();
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('slug') slug: string) {
    return this.courseService.findOne(slug);
  }

  @Mutation(() => Course)
  updateCourse(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCourseInput') updateCourseInput: CourseUpdateInput,
  ) {
    return this.courseService.update(id, updateCourseInput);
  }

  @Mutation(() => CourseContent)
  updateCourseContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CourseContentUpdateInput,
  ) {
    return this.courseService.updateContent(id, input);
  }
  @Mutation(() => StudentCourse)
  updateStudentCourse(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: StudentCourseUpdateInput,
  ) {
    return this.courseService.updateStudentCourse(id, input);
  }

  @Query(() => StudentCourse)
  findStudentCourse(@Args('where') where: StudentCourseWhereInput) {
    return this.courseService.findStudentCourse(where);
  }

  @Mutation(() => Course)
  removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.courseService.remove(id);
  }
}
