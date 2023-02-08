import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';
const theme = createTheme(
  {
    typography: {
      useNextVariants: true,
      fontFamily: "'Montserrat', sans-serif !important",
      fontSize: 14,
    },
  },
  frFR
);

export default theme;
