import { Player } from './player';

export interface Card {
    courseID: string;
    difficultyIdx: number;
    players: Player[];
    dateLastModified: Date,
    thumbnailURL: string
}
