import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GolfAPIService } from 'src/app/services/golf-api.service';
import { Course } from 'src/app/models/course';
import { Observable, Subscription } from 'rxjs';
import { Player } from 'src/app/models/player';
import { MatDialog } from '@angular/material/dialog';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CardService } from 'src/app/services/card.service';
import { Card } from 'src/app/models/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hole } from 'src/app/models/hole';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private golfApiService: GolfAPIService,
    private dialog: MatDialog,
    private cardService: CardService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  course: Observable<Course>;

  courseSub: Subscription;

  card: Card = {
    difficultyIdx: 0,
    players: [],
    courseID: null,
    dateLastModified: new Date(),
    thumbnailURL: ""
  }
  

  ngOnInit(): void {
    this.card.courseID = this.activatedRoute.snapshot.paramMap.get('id');
    this.course = this.golfApiService.getCourseObservable(this.card.courseID);
    if (this.cardService.firestoreCardId){
      this.card = this.cardService.getGame();
    }
    else if (this.cardService.newCard) {
      this.courseSub = this.course.subscribe(course => {
        this.saveGame(course.thumbnail);
      })

    }
    else {
      this.router.navigate(['home'])
    }
  }
  ngOnDestroy() {
    if (this.courseSub){
      this.courseSub.unsubscribe();
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
    if (this.card.players.length >= 4){
      this.snackBar.open("You can only add up to 4 players.", "", {duration: 2000});
    }
    else {
      let h = [];
      for (let i = 0; i < 18; i++){
        h[i] = null;
      }
      this.card.players.push({
        name: 'test',
        holes: h
      });
    }
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
      if(!newPlayer){
        //makes it so that if they click off the dialog it doesnt do anything
      }
      else if(newPlayer === "delete"){
        this.card.players.splice(playerIdx, 1);
      }
      else if(newPlayer === "cancel"){
        this.snackBar.open("Player edit cancelled.", "", {duration: 2000})
      }
      else if (newPlayer !== null){
        this.card.players[playerIdx] = newPlayer;
        this.snackBar.open("Player saved successfully.", "", {duration: 2000})
      }
      
    });
  }
  saveGame(thumbnailURL: string) {
    this.card.dateLastModified = new Date();
    this.cardService.saveCard({...this.card, thumbnailURL});
  }
  checkIfGameFinish(player: Player, holes: Hole[]) {
    let finished = true;
    for(let i = 0; i < 18; i++){
      if(player.holes[i] === null){
        finished = false;
      }
    }
    if (finished){
      let parSum = 0;
      let playerTot = 0;
      for (let i = 0; i < 18; i++)
      {
        parSum += holes[i].teeBoxes[this.card.difficultyIdx].par || 0;
        playerTot += player.holes[i];
      }
      if (playerTot <= parSum)
      {
        this.snackBar.open(`${player.name} scored ${playerTot - parSum === 0 ? "" : "-"}${playerTot - parSum}! On to the PGA!`, "", {duration: 3500});
      }
      else {
        this.snackBar.open(`${player.name} scored +${playerTot - parSum}. Better luck next time!`, "", {duration: 3500});
      }
    }
  }

}
