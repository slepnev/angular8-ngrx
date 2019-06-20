import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoursesState } from './course.reducer';
import * as fromCourse from './course.reducer';
import { PageQuery } from './course.actions';
import * as fromLessons from './lessons.reducer';

export const selectCoursesState = createFeatureSelector<CoursesState>('courses');
export const selectLessensState = createFeatureSelector<fromLessons.State>('lessons');

export const selectCourseById = (courseId: number) => createSelector(
  selectCoursesState,
  (coursesState: CoursesState) => coursesState && coursesState.entities ? coursesState.entities[courseId] : null
);

export const selectAllCourses = createSelector(
  selectCoursesState,
  fromCourse.selectAll
);

export const selectTotalCourses = createSelector(
  selectCoursesState,
  fromCourse.selectTotal
);

export const selectBeginnerCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.category === 'BEGINNER')
);

export const selectAdvancedCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.category === 'ADVANCED')
);

export const selectPromoTotal = createSelector(
  selectAllCourses,
  courses => courses.filter(course => course.promo).length
);

export const allCoursesLoaded = createSelector(
  selectCoursesState,
  coursesState => coursesState.allCoursesLoaded
);

export const selectAllLessons = createSelector(
  selectLessensState,
  fromLessons.selectAll
);

export const selectLessonsPage = (courseId: number, page: PageQuery) => createSelector(
  selectAllLessons,
  allLessons => {

    const start = page.pageIndex * page.pageSize,
          end = start + page.pageSize;

    return allLessons
            .filter(lesson => lesson.courseId == courseId)
            .slice(start, end);

  }
);

export const selectLessonsLoading = createSelector(
  selectLessensState,
  lessensState => lessensState.loading
);
