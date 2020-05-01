import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Course } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {

  }

  save() {
    const firebaseCourseRef = this.db.doc('/courses/q7O0dJJaQyZ48sLLT7we').ref;
    const angularSecCourseRef = this.db.doc('/courses/SaVJ9mh9vqnCFrPBSbvf').ref;

    const batch = this.db.firestore.batch();

    batch.update(firebaseCourseRef, {titles: {description: 'Yo Firebase Course'}});
    batch.update(angularSecCourseRef, {titles: {description: 'Yo Angular Security Course'}});

    const batch$ = of(batch.commit());

    batch$.subscribe();
  }

}

// you can update multiple documents via id by using the above methods
// the current limit is 500 at a time