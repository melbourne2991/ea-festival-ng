import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TreeNode } from '../festivals-data-formatter';
import { FestivalsService } from '../festivals.service';
import {
  addBandToFestival,
  addBandToRecordLabel,
  makeBand,
  makeFestival,
  makeRecordLabel,
} from '../test-helpers';
import { TreeComponent } from '../tree/tree.component';

import { FestivalsComponent } from './festivals.component';

// Utilities to assist DOM traversal of tree structure
const testId = (id: string) => `[data-testid="${id}"]`;
const treeNode = (element: Element) => {
  return {
    get label() {
      return element.querySelector(testId('app-tree-label'))?.textContent ?? undefined;
    },

    get children() {
      const _children =  element.querySelector(testId('app-tree-children'))?.children

      if (_children) {
        return Array.from(
          _children
        ).map((it) => treeNode(it.querySelector('app-tree')!));
      }

      return undefined;
    },

    get pojo(): TreeNode {
      const obj: TreeNode = {
        label: this.label,
      }

      const children = this.children?.map(it => it.pojo)

      if (children) {
        obj.children = children
      }

      return obj;
    }
  };
};

describe('FestivalsComponent', () => {
  let component: FestivalsComponent;
  let fixture: ComponentFixture<FestivalsComponent>;
  let festivalsServiceSpy: jasmine.SpyObj<FestivalsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FestivalsService', ['getFestivalsData']);

    await TestBed.configureTestingModule({
      declarations: [FestivalsComponent, TreeComponent],
      providers: [{ provide: FestivalsService, useValue: spy }],
    }).compileComponents();

    festivalsServiceSpy = TestBed.inject(
      FestivalsService
    ) as jasmine.SpyObj<FestivalsService>;
    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [],
        festivals: [],
        recordLabels: [],
      })
    );

    fixture = TestBed.createComponent(FestivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a message when there is no data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toBe('No data to show.');
  });

  it('should list out record labels', () => {
    const bandA = makeBand('ba', 'Band Awesome');
    const bandB = makeBand('bb', 'Cool Awesome Band');

    const recordLabelA = makeRecordLabel('ra', 'That label');
    const recordLabelB = makeRecordLabel('rb', 'Another label');

    const festivalA = makeFestival('fa', 'Festivals R Amazing');
    const festivalB = makeFestival('fb', 'I heart festivals');

    addBandToFestival(festivalA, bandA);
    addBandToFestival(festivalB, bandB);
    addBandToRecordLabel(recordLabelA, bandA);
    addBandToRecordLabel(recordLabelB, bandB);

    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [bandA, bandB],
        festivals: [festivalA, festivalB],
        recordLabels: [recordLabelA, recordLabelB],
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const recordLabelNodes = compiled.querySelectorAll(testId('record-label'));
    expect(recordLabelNodes.length).toBe(2);
    
    expect(treeNode(recordLabelNodes[0]).pojo).toEqual({
      label: 'That label',
      children: [
        {
          label: 'Band Awesome',
          children: [
            {
              label: 'Festivals R Amazing'
            }
          ]
        }
      ]
    })

    expect(treeNode(recordLabelNodes[1]).pojo).toEqual({
      label: 'Another label',
      children: [
        {
          label: 'Cool Awesome Band',
          children: [
            {
              label: 'I heart festivals'
            }
          ]
        }
      ]
    })
  });

  it('should give bands with empty names but different ids, different placeholder names', () => {
    const bandA = makeBand('ba', '')
    const bandB = makeBand('bb', '')

    const recordLabelA = makeRecordLabel('ra', 'That label')
    const recordLabelB = makeRecordLabel('rb', 'Another label')

    const festivalA = makeFestival('fa', 'Festivals R Amazing')
    const festivalB = makeFestival('fb', 'I heart festivals')

    addBandToFestival(festivalA, bandA)
    addBandToFestival(festivalB, bandA)
    addBandToFestival(festivalB, bandB)

    addBandToRecordLabel(recordLabelA, bandB)
    addBandToRecordLabel(recordLabelB, bandA)
    
    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [bandA, bandB],
        festivals: [festivalA, festivalB],
        recordLabels: [recordLabelA, recordLabelB],
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const recordLabelNodes = compiled.querySelectorAll(testId('record-label'));
    expect(recordLabelNodes.length).toBe(2);


    expect(treeNode(recordLabelNodes[0]).pojo).toEqual({
      label: 'That label',
      children: [
        {
          label: 'Unnamed Band (0)',
          children: [
            {
              label: 'I heart festivals'
            }
          ]
        }
      ]
    })

    expect(treeNode(recordLabelNodes[1]).pojo).toEqual({
      label: 'Another label',
      children: [
        {
          label: 'Unnamed Band (1)',
          children: [
            {
              label: 'Festivals R Amazing'
            },
            {
              label: 'I heart festivals'
            }
          ]
        }
      ]
    })
  });


  it('should give festivals with no names, but different ids, different placeholder names', () => {
    const bandA = makeBand('ba', 'Band Awesome')
    const bandB = makeBand('bb', 'Cool Awesome Band')

    const recordLabelA = makeRecordLabel('ra', 'That label')
    const recordLabelB = makeRecordLabel('rb', 'Another label')

    const festivalA = makeFestival('fa', 'Festivals R Amazing')
    const festivalB = makeFestival('fb', 'I heart festivals')
    const festivalC = makeFestival('fc')
    const festivalD = makeFestival('fd', '')

    addBandToFestival(festivalA, bandA)
    addBandToFestival(festivalB, bandB)
    addBandToFestival(festivalC, bandA)
    addBandToFestival(festivalD, bandA)
    addBandToFestival(festivalD, bandB)
    addBandToRecordLabel(recordLabelA, bandA)
    addBandToRecordLabel(recordLabelB, bandB)

    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [bandA, bandB],
        festivals: [festivalA, festivalB, festivalC, festivalD],
        recordLabels: [recordLabelA, recordLabelB],
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const recordLabelNodes = compiled.querySelectorAll(testId('record-label'));

    expect(treeNode(recordLabelNodes[0]).pojo).toEqual({
      "label": "That label",
      "children": [
        {
          "label": "Band Awesome",
          "children": [
            {
              "label": "Festivals R Amazing"
            },
            {
              "label": "Unnamed Festival (0)"
            },
            {
              "label": "Unnamed Festival (1)"
            }
          ]
        }
      ]
    })

    expect(treeNode(recordLabelNodes[1]).pojo).toEqual({
      "label": "Another label",
      "children": [
        {
          "label": "Cool Awesome Band",
          "children": [
            {
              "label": "I heart festivals"
            },
            {
              "label": "Unnamed Festival (1)"
            }
          ]
        }
      ]
    })

    expect(treeNode(recordLabelNodes[1]).pojo).toEqual({
      "label": "Another label",
      "children": [
        {
          "label": "Cool Awesome Band",
          "children": [
            {
              "label": "I heart festivals"
            },
            {
              "label": "Unnamed Festival (1)"
            }
          ]
        }
      ]
    })



  });

  it('should put bands with no record label under a special category', () => {
    const bandA = makeBand('ba', 'Band Awesome')
    const bandB = makeBand('bb', 'Cool Awesome Band')

    const festivalA = makeFestival('fa', 'Festivals R Amazing')
    const festivalB = makeFestival('fb', 'I heart festivals')

    const recordLabelA = makeRecordLabel('ra', 'That label')
    const recordLabelB = makeRecordLabel('rb', 'Another label')

    addBandToFestival(festivalA, bandA)
    addBandToFestival(festivalB, bandB)

    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [bandA, bandB],
        festivals: [festivalA, festivalB],
        recordLabels: [recordLabelA, recordLabelB],
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const recordLabelNodes = compiled.querySelectorAll(testId('record-label'));
    
    expect(treeNode(recordLabelNodes[0]).pojo).toEqual({
      label: 'That label'
    })

    expect(treeNode(recordLabelNodes[1]).pojo).toEqual({
      label: 'Another label'
    })

    expect(treeNode(recordLabelNodes[2]).pojo).toEqual({
      "label": "[No label]",
      "children": [
        {
          "label": "Band Awesome",
          "children": [
            {
              "label": "Festivals R Amazing"
            }
          ]
        },
        {
          "label": "Cool Awesome Band",
          "children": [
            {
              "label": "I heart festivals"
            }
          ]
        }
      ]
    })
  });

  it('should show "No data to display." when there is no data', () => {
    festivalsServiceSpy.getFestivalsData.and.returnValue(
      of({
        bands: [],
        festivals: [],
        recordLabels: [],
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const noDataMessage = compiled.querySelector(testId('no-data-message'));

    expect(noDataMessage?.textContent).toEqual('No data to show.')
  });
});
