import { Hole } from './hole';

export interface Course {
    id: string;
    holes: Hole[];
    difficulties: {
        teeType: string,
        teeHexColor: string,
        teeTypeId: number
    }[];
}
