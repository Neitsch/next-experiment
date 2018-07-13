/* tslint:disable-next-line */
import green from "@material-ui/core/colors/green";
/* tslint:disable-next-line */
import purple from "@material-ui/core/colors/purple";
import {
  createGenerateClassName,
  createMuiTheme,
  /* tslint:disable-next-line */
} from "@material-ui/core/styles";
import { SheetsRegistry } from "jss";

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: purple[700],
      light: purple[300],
      main: purple[500],
    },
    secondary: {
      dark: green[700],
      light: green[300],
      main: green[500],
    },
  },
});

function createPageContext() {
  return {
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    theme,
  };
}

export function getPageContext() {
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
