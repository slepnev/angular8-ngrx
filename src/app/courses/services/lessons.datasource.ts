import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Lesson } from '../model/lesson';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { LessonsPageRequested, PageQuery } from '../course.actions';
import { selectLessonsPage } from '../course.selectors';
import { catchError, tap } from 'rxjs/operators';


export class LessonsDataSource implements DataSource<Lesson> {

  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);


  constructor(private store: Store<AppState>) {

  }

  loadLessons(courseId: number, page: PageQuery) {

    this.store
      .pipe(
        select(selectLessonsPage(courseId, page)),
        tap(lessons => {
          if (lessons.length) {
            this.lessonsSubject.next(lessons);
          } else {
            this.lessonsSubject.next([]);
            this.store.dispatch(new LessonsPageRequested({courseId, page}));
          }
        }),
        catchError(err => of([]))
      )
      .subscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
    console.log('Connecting data source');
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
  }

}

