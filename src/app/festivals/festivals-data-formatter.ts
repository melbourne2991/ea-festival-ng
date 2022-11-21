import { Band, Festival, RecordLabel } from "./festivals-data-mapper";

interface NoRecordLabel extends Omit<RecordLabel, 'id'> {
  id: symbol
}

export interface TreeNode {
  label?: string;
  children?: TreeNode[]
}

export class FestivalsDataFormatter {
  public static formatFestivalData = (recordLabels: RecordLabel[], bands: Band[]) => {
    const formatter = new this()
    return formatter.formatFestivalData(recordLabels, bands)
  }

  private names = {
    band: new Map<string | symbol, string>(),
    festival: new Map<string | symbol, string>(),
    recordLabel: new Map<string | symbol, string>(),
  };

  private unnamedCounts = {
    band: 0,
    festival: 0,
    recordLabel: 0,
  };

  /**
   * This ensures if we have multiple unnamed bands or festivals (empty strings),
   * they still get different names to distinguish between them.
   * 
   * i.e we assume two festivals represented as two distinct objects in the array 
   * with the name `""` are NOT the same festival.
   */
  private getName = <K extends keyof typeof this.names>(
    key: K,
    item: { id: string | symbol; name: string | undefined },
    fallback: string
  ) => {
    let name = this.names[key].get(item.id);

    if (name) {
      return name;
    }

    name = !item.name?.trim()
      ? `Unnamed ${fallback} (${this.unnamedCounts[key]++})`
      : item.name;

    this.names[key].set(item.id, name);

    return name;
  };

  private formatFestivalData = (recordLabels: RecordLabel[], bands: Band[]) => {
    const noLabelBands = bands.filter((band) => band.recordLabel === undefined);

    const recordLabelsToFormat = noLabelBands.length
      ? [
          ...recordLabels,
          {
            // Assign a special id to this record label
            // To ensure no collisions we use a symbol
            id: Symbol('No Label'),
            name: "[No label]",
            bands: noLabelBands,
          },
        ]
      : recordLabels;

    return this.formatRecordLabels(recordLabelsToFormat);
  };

  private static indent(count: number) {
    return new Array(count).fill(" ").join("");
  }

  private formatFestivals = (festivals: Festival[]) => {
    return festivals
      .map((festival) => {
        // const name = this.getName("festival", festival, "Festival");
        // return `${FestivalsDataFormatter.indent(6)}${name}\n`;

        return {
          label: this.getName("festival", festival, "Festival"),
        }
      })
      // .join("");
  };

  private formatBands = (bands: Band[]) => {
    return bands
      .map((band) => {

        return {
          label: this.getName("band", band, "Band"),
          children: this.formatFestivals(band.festivals)
        }
        // const name = this.getName("band", band, "Band");
        // return `${FestivalsDataFormatter.indent(3)}${name}\n${this.formatFestivals(band.festivals)}`;
      })
      // .join("");
  };

  private formatRecordLabels = (recordLabels: (RecordLabel | NoRecordLabel)[]): TreeNode[] => {
    return recordLabels
      .map((recordLabel) => {
        return {
          label: this.getName("recordLabel", recordLabel, "Record Label"),
          children: this.formatBands(recordLabel.bands)
        }

        // const name = this.getName("recordLabel", recordLabel, "Record Label");
        // return `${name}\n${this.formatBands(recordLabel.bands)}\n`;
      })
      // .join("");
  };
}
