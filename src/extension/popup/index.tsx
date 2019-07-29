import blue from '@material-ui/core/colors/blue';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import React from 'react';
import * as ReactDOM from 'react-dom';

const useConfig = async <T extends any>(key: string, defV: T): Promise<[T, (newT: T) => void]> => {
  return [
    await new Promise<T>((ok) => chrome.storage.local.get({ [key]: defV }, (map) => ok(map[key]))),
    (newT) => chrome.storage.local.set({ [key]: newT }),
  ];
};

const theme = createMuiTheme({
  palette: {
    secondary: blue,
  },
  typography: {
    fontSize: 10,
  },
});

(async () => {
  const [isDisplayDefault, setIsDisplayDefault] = await useConfig('isDisplayDefault', false);
  const [enableBackgroundColor, setEnableBackgroundColor] = await useConfig('enableBackgroundColor', false);

  const App = () => {
    const [$isDisplayDefault, $setIsDisplayDefault] = React.useState(isDisplayDefault);
    React.useEffect(() => setIsDisplayDefault($isDisplayDefault), [$isDisplayDefault]);

    const [$enableBackgroundColor, $setEnableBackgroundColor] = React.useState(enableBackgroundColor);
    React.useEffect(() => setEnableBackgroundColor($enableBackgroundColor), [$enableBackgroundColor]);

    return (
      <MuiThemeProvider theme={theme}>
        <FormGroup>
          <FormControlLabel
            label="レビュー状況を表示するか"
            control={
              <Switch
                size="small"
                checked={$isDisplayDefault}
                onChange={(_, checked) => $setIsDisplayDefault(checked)}
              />
            }
          />
          <FormControlLabel
            label="自分のレビュー状況に応じてPR一覧の背景色を変更するか"
            control={
              <Switch
                size="small"
                checked={$enableBackgroundColor}
                onChange={(_, checked) => $setEnableBackgroundColor(checked)}
              />
            }
          />
        </FormGroup>
      </MuiThemeProvider>
    );
  };

  ReactDOM.render(<App />, document.getElementById('app'));
})();
