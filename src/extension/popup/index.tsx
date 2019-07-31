import blue from '@material-ui/core/colors/blue';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { useConfig } from '../../external/chrome';

const theme = createMuiTheme({
  palette: {
    secondary: blue,
  },
  typography: {
    fontSize: 13,
  },
});

(async () => {
  const [isDisplayDefault, setIsDisplayDefault] = await useConfig('isDisplayDefault');
  const [enableBackgroundColor, setEnableBackgroundColor] = await useConfig('enableBackgroundColor');

  const App = () => {
    const [$isDisplayDefault, $setIsDisplayDefault] = React.useState(isDisplayDefault);
    React.useEffect(() => setIsDisplayDefault($isDisplayDefault), [$isDisplayDefault]);

    const [$enableBackgroundColor, $setEnableBackgroundColor] = React.useState(enableBackgroundColor);
    React.useEffect(() => setEnableBackgroundColor($enableBackgroundColor), [$enableBackgroundColor]);

    return (
      <MuiThemeProvider theme={theme}>
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <Icon>ballot</Icon>
            </ListItemIcon>
            <ListItemText primary="Display review status" secondary="レビュー状況を表示する" />
            <ListItemSecondaryAction>
              <Switch
                size="small"
                checked={$isDisplayDefault}
                onChange={(_, checked) => $setIsDisplayDefault(checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon>format_paint</Icon>
            </ListItemIcon>
            <ListItemText
              primary="Enable row background color"
              secondary={
                <span>
                  自分のレビュー状況に応じて
                  <br />
                  リストの背景色を変更する
                </span>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                size="small"
                checked={$enableBackgroundColor}
                onChange={(_, checked) => $setEnableBackgroundColor(checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </MuiThemeProvider>
    );
  };

  ReactDOM.render(<App />, document.getElementById('app'));
})();
