import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { convertSnaps } from './db-util';
import { Lesson } from '../model/lesson';
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection('courses', ref => ref.orderBy('seqNo'))
    .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Course>(snaps)),
        first()); 
        // First() requires you to refresh to see any changes as Observable has been completed and this is more 
        // like http behaviour that a user is maybe used too
        // If removed then any changes would be made live straight away, so depends on the amount of data that you have
        // You can also replace snapshotChanges to stateChanges which only updates an individual document rather than a whole collection
        // ref.orderBy sorts the docs from the collection using the seqNo
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db.collection('courses',
      ref => ref.where('url', '==', courseUrl))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps);
          return courses.length == 1 ? courses[0] : undefined;
        }),
        first()
    )
  }

  findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
    return this.db.collection(`courses/${courseId}/lessons`, 
      ref => ref.orderBy('seqNo', sortOrder)
            .limit(pageSize)
            .startAfter(pageNumber * pageSize))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Lesson>(snaps)),
        first()
      )
  }

}

// using ref => ref.where('seqNo', '==', 5).where('lessonsCount', '>=', 5)) shows an error in the console
// firebase asks you to create an index for compound querys like the above