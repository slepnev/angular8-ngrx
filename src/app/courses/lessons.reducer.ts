import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Lesson } from './model/lesson';
import { CourseActions, CourseActionTypes } from './course.actions';


export interface State extends EntityState<Lesson> {
  loading: boolean
}

function sortByCourseAndSeqNo(l1: Lesson, l2: Lesson) {
  const compare = l1.courseId - l2.courseId;
  if (compare != 0) {
    return compare;
  } else {
    return l1.seqNo - l2.seqNo;
  }
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
  sortComparer: sortByCourseAndSeqNo
});

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(state = initialState, action: CourseActions): State {
  switch (action.type) {

    case CourseActionTypes.LessonsPageRequested:
      return {...state, loading: true};

    case CourseActionTypes.LessonsPageLoaded:
      return adapter.addMany(action.payload.lessons, {...state, loading: false});

    case CourseActionTypes.LessonsPageCancelled:
      return {...state, loading: false};

    default:
      return state;
  }
}


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
