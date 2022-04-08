import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <PaperProvider theme={{ ...DefaultTheme }}>
      <AuthProvider>
        <StatusBar backgroundColor={'black'} />
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
