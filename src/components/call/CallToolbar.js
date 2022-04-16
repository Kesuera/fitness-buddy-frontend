import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { VideoCallContext } from '../../context/VideoCallContext';

const CallToolbar = () => {
  const { switchCamera, toggleMute, hangup, isMuted } =
    useContext(VideoCallContext);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon="camera-switch"
        size={40}
        style={{ backgroundColor: colors.background }}
        onPress={() => {
          switchCamera();
        }}
      />
      <IconButton
        icon="phone-hangup"
        color={colors.background}
        size={40}
        style={{ backgroundColor: colors.error }}
        onPress={() => {
          hangup();
        }}
      />
      <IconButton
        icon={isMuted ? 'microphone' : 'microphone-off'}
        size={40}
        style={{ backgroundColor: colors.background }}
        onPress={() => {
          toggleMute();
        }}
      />
    </View>
  );
};

export default CallToolbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    margin: 24,
  },
});
