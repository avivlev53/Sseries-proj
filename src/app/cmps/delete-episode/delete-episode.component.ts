import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SeriesService} from '../../services/series.service';

@Component({
  selector: 'app-delete-episode',
  templateUrl: './delete-episode.component.html',
  styleUrls: ['./delete-episode.component.scss']
})
export class DeleteEpisodeComponent implements OnInit {
  constructor(public seriesService:SeriesService,public dialogRef: MatDialogRef<DeleteEpisodeComponent>,@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  deleteEpisode(){
    this.seriesService.deleteEpisode(this.data);
  }
}
