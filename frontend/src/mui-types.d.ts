// This file extends MUI's Grid definitions to support the item and container props
import '@mui/material/Grid';
import { ElementType } from 'react';

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
    container?: boolean;
    component?: ElementType;
  }
} 