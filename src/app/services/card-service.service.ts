import { Injectable } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  constructor() { }

  saveCard(card: Card){
    localStorage.setItem(card.courseID, JSON.stringify(card));
  }
  
  loadCard(courseId: string): Card {
    return JSON.parse(localStorage.getItem(courseId));
  }

}
