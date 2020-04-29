import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection('courses', ref => ref.where('seqNo', '==', 5)
    .where('lessonsCount', '>=', 5))
    .snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
              return <Course> {
                  id: snap.payload.doc.id,
                  ...snap.payload.doc.data() as {}
              }
          });
      }),
        
        first()); 
        // First() requires you to refresh to see any changes as Observable has been completed and this is more 
        // like http behaviour that a user is maybe used too
        // If removed then any changes would be made live straight away, so depends on the amount of data that you have
        // You can also replace snapshotChanges to stateChanges which only updates an individual document rather than a whole collection
        // ref.orderBy sorts the docs from the collection using the seqNo
  }


}
