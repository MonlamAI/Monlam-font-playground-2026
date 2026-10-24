/** Default script styles — seeded into CMS and used when API is offline. */
export interface ScriptStyleSeed {
  id: string;
  name: string;
  tibetanName: string;
  sortOrder: number;
}

export const DEFAULT_SCRIPT_STYLES: ScriptStyleSeed[] = [
  { id: 'Uchen', name: 'Uchen', tibetanName: 'དབུ་ཅན།', sortOrder: 0 },
  { id: 'Umê', name: 'Ume and Chug', tibetanName: 'དབུ་མེད་དང་འཁྱུག', sortOrder: 1 },
  { id: 'Drutsa', name: 'Drutsa', tibetanName: 'འབྲུ་ཚ།', sortOrder: 2 },
  { id: 'Tsugring', name: 'Tsugring', tibetanName: 'ཚུགས་རིང་།', sortOrder: 3 },
  { id: 'Petsug', name: 'Petsug', tibetanName: 'དཔེ་ཚུགས།', sortOrder: 4 },
  { id: 'Modern', name: 'Modern and Sans', tibetanName: 'དེང་རབས་དང་ཟུར་རྒྱན་མེད་པ།', sortOrder: 5 },
  { id: 'Standard', name: 'Standard', tibetanName: 'ཚད་ལྡན།', sortOrder: 6 }
];
