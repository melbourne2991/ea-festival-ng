import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, of, retry, throwError } from 'rxjs';
import { FestivalsApiService } from 'src/generated/openapi';
import { FestivalsDataFormatter } from './festivals-data-formatter';
import { FestivalsDataMapper } from './festivals-data-mapper';

@Injectable({
  providedIn: 'root',
})
export class FestivalsService {
  constructor(private festivalsApiService: FestivalsApiService) {}

  getFestivalsData() {
    return this.festivalsApiService
      .aPIFestivalsGet()
      .pipe(retry({
        count: 5,
        resetOnSuccess: true,
        delay: (e: HttpErrorResponse, retryCount) => {
          if (e.status == 429) {
            const delayAmount = 2 ** retryCount * 100
            console.log('Hit rate limit, retrying in ')
            return of(null).pipe(delay(delayAmount));
          }

          return throwError(() => e)
        }
      }))
      .pipe(map((value) => (value as unknown) === "" ? [] : value))
      .pipe(map(FestivalsDataMapper.mapFestivalData))
  }
}
