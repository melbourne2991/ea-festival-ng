import { Band, Festival, RecordLabel } from "./festivals-data-mapper";

export const makeBand = (id: string, name: string): Band => ({
  id, name,
  festivals: []
})

export const makeFestival = (id: string, name?: string): Festival => ({
  id, name: name ?? undefined,
  bands: []
})

export const makeRecordLabel = (id: string, name: string): RecordLabel => ({
  id, name,
  bands: []
})

export const addBandToFestival = (festival: Festival, band: Band) => {
  band.festivals.push(festival)
  festival.bands.push(band)
} 

export const addBandToRecordLabel = (recordLabel: RecordLabel, band: Band) => {
  band.recordLabel = recordLabel
  recordLabel.bands.push(band)
} 