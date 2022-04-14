import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ClientProvider } from './src/context/ClientContext';
import { SharedProvider } from './src/context/SharedContext';
import { TrainerProvider } from './src/context/TrainerContext';
import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <PaperProvider theme={{ ...DefaultTheme }}>
      <AuthProvider>
        <ClientProvider>
          <TrainerProvider>
            <SharedProvider>
              <StatusBar backgroundColor={'black'} />
              <Navigation />
            </SharedProvider>
          </TrainerProvider>
        </ClientProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
