import type { BaseFile } from "./tree";

export type FileData = BaseFile & {
  name: string;
  id: number;
  indexes: number[];
};
