import { Component, OnInit } from '@angular/core';
import { GolfAPIService } from 'src/app/services/golf-api.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course';
import { CardService } from 'src/app/services/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  course$: Observable<any>
  constructor(
    private golfAPIService: GolfAPIService,
    public cardService: CardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.course$ = this.golfAPIService.getCoursesObservable();
    this.cardService.firestoreCardId = null;
  }

  onCardClick(cardIdx: number, courseId: number) {
    this.cardService.firestoreCardId = this.cardService.firestoreCardIds[cardIdx];
    this.cardService.selectedCardIdx = cardIdx;
    this.router.navigate(['card', {id: courseId}])
  }

  deleteCard(cardIdx: number) {
    
    this.cardService.deleteCard(this.cardService.firestoreCardIds[cardIdx]);
  }

}
