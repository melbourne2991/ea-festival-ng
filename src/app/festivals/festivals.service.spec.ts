import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { firstValueFrom, Observable, of } from 'rxjs';
import { FestivalsApiService, MusicFestival } from 'src/generated/openapi';

import { FestivalsService } from './festivals.service';

describe('FestivalsService', () => {
  let service: FestivalsService;
  let festivalsApiServiceSpy: jasmine.SpyObj<FestivalsApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('FestivalsApiService', [
      'aPIFestivalsGet',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: FestivalsApiService, useValue: spy }],
    });

    service = TestBed.inject(FestivalsService);
    festivalsApiServiceSpy = TestBed.inject(
      FestivalsApiService
    ) as jasmine.SpyObj<FestivalsApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFestivalsData should return data', async () => {
    const festivals: MusicFestival[] = [
      {
        name: 'Festival 1',
        bands: [
          {
            name: 'Cool band',
            recordLabel: 'That label',
          },
        ],
      },

      {
        name: 'Festival 2',
        bands: [
          {
            name: 'Another band',
            recordLabel: 'Another label',
          },
        ],
      },
    ];

    festivalsApiServiceSpy.aPIFestivalsGet.and.returnValue(
      of(festivals) as any
    );

    service.getFestivalsData().subscribe((value) => {
      expect(value.bands.length).toBe(2);
      expect(value.festivals.length).toBe(2);
      expect(value.recordLabels.length).toBe(2);

      expect(value.bands[0]?.name).toBe('Cool band');
      expect(value.bands[1]?.name).toBe('Another band');

      expect(value.festivals[0]?.name).toBe('Festival 1');
      expect(value.festivals[1]?.name).toBe('Festival 2');

      expect(value.recordLabels[0]?.name).toBe('That label');
      expect(value.recordLabels[1]?.name).toBe('Another label');
    });
  });

  it('should retry rate limited requests', fakeAsync(async () => {
    const returnValues = [
      {
        type: 'error' as const,
        value: { status: 429 },
      },

      {
        type: 'error' as const,
        value: { status: 429 },
      },

      {
        type: 'next' as const,
        value: [],
      },
    ];

    let returnValueIdx = 0;

    festivalsApiServiceSpy.aPIFestivalsGet.and.returnValue(
      new Observable((sub) => {
        const rv = returnValues[returnValueIdx];
        sub[rv.type](rv.value as any);
        returnValueIdx++;
      })
    );

    const firstValuePromise = firstValueFrom(service.getFestivalsData());

    tick(30000);

    expect(await firstValuePromise).toEqual({
      bands: [],
      recordLabels: [],
      festivals: [],
    });
  }));
});
