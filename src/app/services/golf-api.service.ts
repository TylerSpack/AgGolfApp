import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GolfAPIService {

  constructor(
    private http: HttpClient
  ) { }

  getCoursesObservable(): Observable<any> {
    return this.http.get<any>('https://golf-courses-api.herokuapp.com/courses').pipe(
      map(coursesObj => {
        return coursesObj.courses;
      })
    );
  }

  getCourseObservable(courseId): Observable<Course> {
    return this.http.get<any>(`https://golf-courses-api.herokuapp.com/courses/${courseId}`).pipe(
      map(coursesObj => {
        // console.log('difficulties', coursesObj.data.holes[0].teeBoxes)
        console.log(coursesObj);
        return {
          ...coursesObj.data,
          difficulties: coursesObj.data.holes[0].teeBoxes
        };

      })
    );;
  }
}
