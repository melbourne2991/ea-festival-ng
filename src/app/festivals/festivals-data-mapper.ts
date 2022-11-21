import { Band as BandDTO, MusicFestival as FestivalDTO } from "../../generated/openapi";

export interface Band {
  id: string;
  name: string | undefined;
  festivals: Festival[];
  recordLabel?: RecordLabel;
}

export interface Festival {
  id: string;
  name: string | undefined;
  bands: Band[];
}

export interface RecordLabel {
  id: string;
  name: string
  bands: Band[];
}

export type Table<T> = {
  allIds: string[];
  byId: Record<string, T>;
};

export class FestivalsDataMapper {
  static mapFestivalData = (rawData: FestivalDTO[] = []) => {
    const mapped = new this(rawData)

    return {
      bands: mapped.bands.allIds.map(id => mapped.bands.byId[id]!),
      festivals: mapped.festivals.allIds.map(id => mapped.festivals.byId[id]!),
      recordLabels: mapped.recordLabels.allIds.map(id => mapped.recordLabels.byId[id]!)
    }
  }

  private bands: Table<Band> = {
    allIds: [],
    byId: {},
  };

  private festivals: Table<Festival> = {
    allIds: [],
    byId: {},
  };

  private recordLabels: Table<RecordLabel> = {
    allIds: [],
    byId: {},
  };

  private constructor(private readonly rawData: FestivalDTO[]) {
    this.mapFestivals();

    this.bands.allIds = Object.keys(this.bands.byId);
    this.festivals.allIds = Object.keys(this.festivals.byId);
    this.recordLabels.allIds = Object.keys(this.recordLabels.byId);
  }

  private mapFestivals() {
    return this.rawData.map((rawFestival, festivalIdx) => {
      const festivalId = `${festivalIdx}`;

      const festival: Festival = {
        id: festivalId,
        name: rawFestival.name,
        bands: [],
      };

      if (rawFestival.bands) {
        festival.bands = this.mapBands(festival, rawFestival.bands)
      }

      this.festivals.byId[festivalId] = festival;

      return festivalId;
    });
  }

  private mapBands(festival: Festival, bands: BandDTO[]) {
    return bands.map((rawBand, bandIdx) => {
      const bandId = rawBand.name ?? `${festival.id}${bandIdx}`;

      this.bands.byId[bandId] = this.bands.byId[bandId] ?? {
        id: bandId,
        name: rawBand.name,
        festivals: [],
      };

      if (rawBand.recordLabel !== undefined) {
        this.bands.byId[bandId]!.recordLabel = this.mapRecordLabel(
          rawBand.recordLabel,
          festival,
          this.bands.byId[bandId]!
        );
      }

      this.bands.byId[bandId]!.festivals.push(festival);

      return this.bands.byId[bandId]!;
    });
  }

  private mapRecordLabel(
    recordLabel: string,
    festival: Festival,
    band: Band
  ) {
    // If the band has a record label but the string is empty, we consider it unique, else we take the name as the id.
    let recordLabelId =
      recordLabel.trim() === "" ? `${festival.id}${band.id}` : recordLabel;

    this.recordLabels.byId[recordLabelId] = this.recordLabels.byId[
      recordLabelId
    ] ?? {
      id: recordLabelId,
      name: recordLabel,
      bands: [],
    };

    this.recordLabels.byId[recordLabelId]!.bands.push(band);

    return this.recordLabels.byId[recordLabelId]!;
  }
}
