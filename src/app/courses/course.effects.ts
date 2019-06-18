import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AllCoursesLoaded,
  AllCoursesRequested,
  CourseActionTypes,
  CourseLoaded,
  CourseRequested
} from './course.actions';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { CoursesService } from './services/courses.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { allCoursesLoaded } from './course.selectors';


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

  constructor(private actions$: Actions, private coursesService: CoursesService, private store: Store<AppState>) {
  }


}
