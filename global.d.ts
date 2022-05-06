declare module "chalk-table" {
  export interface Options {
    leftPad: number;
    columns: {
      field: string;
      name: string;
    }[];
  }

  export default function (options: Options, data: unknown[]): string;
}
