import '@mui/material/styles';
import '@mui/material/Grid';
import { ElementType } from 'react';

// Custom type definition to fix the MUI Grid type issues
declare module '@mui/material/Grid' {
  interface GridTypeMap {
    props: {
      container?: boolean;
      item?: boolean;
      xs?: number | boolean;
      sm?: number | boolean;
      md?: number | boolean;
      lg?: number | boolean;
      xl?: number | boolean;
    };
  }
} 