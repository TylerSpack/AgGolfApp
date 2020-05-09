import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss']
})
export class PlayerEditComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlayerEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player) {}

  oldPlayerName: string;
  ngOnInit(): void {
    this.oldPlayerName = this.data.name;
  }

  save() {
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.dialogRef.close("cancel");
  }

  deletePlayer() {
    this.dialogRef.close("delete");
  }

}
