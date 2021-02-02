import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans"',
    fontWeightRegular: '600',
  },
  palette: {
    primary: {
      main: '#3A8DFF',
    },
    secondary: {
      main: '#1CED84',
    },
    error: {
      main: '#D0DAE9',
    },
  },
});
