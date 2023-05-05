import React from 'react';
import Navigation from './src/Navigation';
import {ThemeProvider} from "react-native-elements";
import theme from './src/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );

}
