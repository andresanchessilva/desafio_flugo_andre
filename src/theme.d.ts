import { Palette, PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    successChip: {
      main: string;
      background: string;
    };
    errorChip: {
      main: string;
      background: string;
    };
  }

  interface PaletteOptions {
    successChip?: {
      main?: string;
      background?: string;
    };
    errorChip?: {
      main?: string;
      background?: string;
    };
  }
}
