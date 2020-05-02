import { Component, OnInit } from '@angular/core';
import { GolfAPIService } from 'src/app/services/golf-api.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  course$: Observable<any>
  constructor(
    private golfAPIService: GolfAPIService
  ) { }

  ngOnInit(): void {
    this.course$ = this.golfAPIService.getCoursesObservable();
  }

  onCardClick(courseId) {

  }

}
