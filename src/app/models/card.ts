import { Player } from './player';

export interface Card {
    courseID: string;
    difficultyIdx: number;
    players: Player[];
    dateCreated: Date,
    thumbnailURL: string
}
