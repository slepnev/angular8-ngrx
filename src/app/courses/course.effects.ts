import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AllCoursesLoaded,
  AllCoursesRequested,
  CourseActionTypes,
  CourseLoaded,
  CourseRequested,
  LessonsPageCancelled,
  LessonsPageLoaded,
  LessonsPageRequested
} from './course.actions';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { CoursesService } from './services/courses.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { allCoursesLoaded } from './course.selectors';
import { of } from 'rxjs';


@Injectable()
export class CourseEffects {

  @Effect()
  loadCourse$ = this.actions$.pipe(
    ofType<CourseRequested>(CourseActionTypes.CourseRequested),
    mergeMap(action => this.coursesService.findCourseById(action.payload.courseId)),
    map(course => new CourseLoaded({course})),
  );

  @Effect()
  loadCourses$ = this.actions$.pipe(
    ofType<AllCoursesRequested>(CourseActionTypes.AllCoursesRequested),
    withLatestFrom(this.store.pipe(select(allCoursesLoaded))),
    filter(([action, allCoursesLoaded]) => !allCoursesLoaded),
    mergeMap(action => this.coursesService.findAllCourses()),
    map(courses => new AllCoursesLoaded({courses})),
  );

  @Effect()
  loadLessonsPage$ = this.actions$
    .pipe(
      ofType<LessonsPageRequested>(CourseActionTypes.LessonsPageRequested),
      mergeMap(({payload}) => {
        return this.coursesService.findLessons(payload.courseId, payload.page.pageIndex, payload.page.pageSize)
          .pipe(
            catchError(err => {
              this.store.dispatch(new LessonsPageCancelled());
              return of([]);
            })
          )
        ;
      }),
      map(lessons => new LessonsPageLoaded({lessons}))
    );

  constructor(private actions$: Actions, private coursesService: CoursesService, private store: Store<AppState>) {
  }


}
