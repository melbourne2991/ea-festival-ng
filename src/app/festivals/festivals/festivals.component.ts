import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { FestivalsDataFormatter, TreeNode } from '../festivals-data-formatter';
import { FestivalsService } from '../festivals.service';

@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.component.html',
  styleUrls: ['./festivals.component.css'],
})
export class FestivalsComponent {
  data$?: Observable<TreeNode[]>;

  constructor(private festivalsService: FestivalsService) {}

  ngOnInit() {
    this.data$ = this.festivalsService
      .getFestivalsData()
      .pipe(
        map(({ bands, recordLabels }) =>
          FestivalsDataFormatter.formatFestivalData(recordLabels, bands)
        )
      );
  }
}
