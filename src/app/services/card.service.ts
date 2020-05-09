import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Card } from '../models/card';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  firestoreCardId: string;
  firestoreCardIds: string[];

  cardsRef: AngularFirestoreCollection;

  cards: Card[];
  newCard = false;
  selectedCardIdx: number;

  constructor(
    private db: AngularFirestore
  ) {
    this.cardsRef = this.db.collection('cards');
    this.db.collection('cards').snapshotChanges().pipe(
      map(cards => {
        this.firestoreCardIds = [];
        return cards.map(card => {
          this.firestoreCardIds.push(card.payload.doc.id);
          return card.payload.doc.data() as Card;
        })
      })
    ).subscribe(c => {
      this.cards = c
      console.log(c)
    });
  }

  saveCard(card: Card) {
    if (this.firestoreCardId) {
      this.cardsRef.doc(this.firestoreCardId).set(card);
    }
    else {
      this.cardsRef.add(card).then(ref => {
        this.firestoreCardId = ref.id;
      });
    }
  }

  getGame() {
    return this.cards[this.selectedCardIdx];
  }
  
  deleteCard(firestoreId: string) {
    this.cardsRef.doc(firestoreId).delete();
  }


}
