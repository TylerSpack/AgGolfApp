import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/models/card';
import { GolfAPIService } from 'src/app/services/golf-api.service';
import { Course } from 'src/app/models/course';
import { Observable } from 'rxjs';
import { Hole } from 'src/app/models/hole';
import { NumberValueAccessor } from '@angular/forms';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private golfApiService: GolfAPIService
  ) { }

  card: Card;
  players: Player[] = [];
  course: Observable<Course>;
  id: string;
  difficulty = 1;

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    //load card from local storage if one exists under that course id
    this.card = JSON.parse(localStorage.getItem(this.id)) || {
      courseID: this.id,
      players: []
    };
    //load course from API (has difficulties to use)
    this.course = this.golfApiService.getCourseObservable(this.id);
  }

  calcHolesSum(holes: any, category: string, low: number, high: number){
    let sum = 0;
    if (category === null){
      for (let i = low - 1; i < high; i++)
      {
        sum += holes[i] || 0;
      }
    }
    else{
      for (let i = low - 1; i < high; i++)
      {
        sum += holes[i].teeBoxes[this.difficulty][category] || 0;
      }
    }
    
    return sum;
  }
  
  addPlayer(){
    this.players.push({
      name: 'test',
      holes: []
    });
  }

}
