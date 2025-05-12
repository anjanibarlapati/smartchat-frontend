
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { DarkTheme, LightTheme } from '../utils/themes';
import { storeState } from '../redux/store';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const mode = useSelector((state: storeState)=> state.theme.mode);

  const themeMode = mode === 'system' ? systemScheme : mode;

  return themeMode === 'dark' ? DarkTheme : LightTheme;
}

