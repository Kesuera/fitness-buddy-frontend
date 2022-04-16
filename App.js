import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ClientProvider } from './src/context/ClientContext';
import { TrainerProvider } from './src/context/TrainerContext';
import { VideoCallProvider } from './src/context/VideoCallContext';
import Navigation from './src/components/navigation/Navigation';
import { navigationRef } from './src/components/navigation/NavigationRef';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <PaperProvider theme={{ ...DefaultTheme }}>
      <AuthProvider>
        <ClientProvider>
          <TrainerProvider>
            <VideoCallProvider>
              <StatusBar backgroundColor={'black'} />
              <NavigationContainer ref={navigationRef}>
                <Navigation />
              </NavigationContainer>
            </VideoCallProvider>
          </TrainerProvider>
        </ClientProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
