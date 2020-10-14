import React from 'react';
import blue from '@material-ui/core/colors/blue';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { INDEXED_DB_CACHE_TABLE_DEFAULT_MAX_AGE } from '../../constant';
import { useConfig } from '../../hooks/useConfig';

export const ExtensionPopup = () => {
  const { config, setConfig, loaded } = useConfig();

  if (!loaded) {
    return null;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <List dense={true}>
        <ListItem>
          <ListItemIcon>
            <Icon>restore</Icon>
          </ListItemIcon>
          <ListItemText primary="Enable cache" secondary="キャッシュを有効化する" />
          <ListItemSecondaryAction>
            <Switch
              size="small"
              checked={config.cacheMaxAge > 0}
              onChange={(_, checked) => setConfig((cfg) => ({ ...cfg, cacheMaxAge: checked ? INDEXED_DB_CACHE_TABLE_DEFAULT_MAX_AGE : 0 }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Icon>ballot</Icon>
          </ListItemIcon>
          <ListItemText primary="Display review status" secondary="レビュー状況を表示する" />
          <ListItemSecondaryAction>
            <Switch
              size="small"
              checked={config.isDisplayDefault}
              onChange={(_, checked) => setConfig((cfg) => ({ ...cfg, isDisplayDefault: checked }))}
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
              checked={config.enableBackgroundColor}
              onChange={(_, checked) => setConfig((cfg) => ({ ...cfg, enableBackgroundColor: checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </MuiThemeProvider>
  );
};

const theme = createMuiTheme({
  palette: {
    secondary: blue,
  },
  typography: {
    fontSize: 13,
  },
});
