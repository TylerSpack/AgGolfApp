import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GolfAPIService } from 'src/app/services/golf-api.service';
import { Course } from 'src/app/models/course';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player';
import { MatDialog } from '@angular/material/dialog';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CardService } from 'src/app/services/card.service';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private golfApiService: GolfAPIService,
    private dialog: MatDialog,
    private cardService: CardService
  ) { }

  course: Observable<Course>;

  card: Card = {
    difficultyIdx: 0,
    players: [],
    courseID: null,
    dateCreated: new Date(),
    thumbnailURL: ""
  }
  

  ngOnInit(): void {
    this.card.courseID = this.activatedRoute.snapshot.paramMap.get('id');
    this.course = this.golfApiService.getCourseObservable(this.card.courseID);
    if (this.cardService.firestoreCardId){
      this.card = this.cardService.getGame();
    }
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
        sum += holes[i].teeBoxes[this.card.difficultyIdx][category] || 0;
      }
    }
    
    return sum;
  }
  addPlayer(){
    let h = [];
    for (let i = 0; i < 18; i++){
      h[i] = null;
    }
    this.card.players.push({
      name: 'test',
      holes: h
    });
  }
  numOfName(playerIdx: number) {
    let playersWithSameName = 0;
    for (let i = playerIdx-1; i >= 0; i--) {
      if(this.card.players[playerIdx].name === this.card.players[i].name){
        playersWithSameName++;
      }
    }
    return playersWithSameName;
  }
  openEditPlayerDialog(player: Player, playerIdx: number): void {
    const dialogRef = this.dialog.open(PlayerEditComponent, {
      data: {...player}
    });

    dialogRef.afterClosed().subscribe(newPlayer => {
      if (newPlayer !== null){
        this.card.players[playerIdx] = newPlayer;
      }
      //TODO: could add popup saying "Player saved successfully." or "Player edit cancelled." (inside else)
    });
  }
  saveGame(thumbnailURL: string) {
    this.cardService.saveCard({...this.card, thumbnailURL});
  }

}
