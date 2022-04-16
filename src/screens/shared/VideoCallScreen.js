import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RTCView } from 'react-native-webrtc';
import { VideoCallContext } from '../../context/VideoCallContext';
import CallToolbar from '../../components/call/CallToolbar';

const VideoCallScreen = () => {
  const { localStream, remoteStream } = useContext(VideoCallContext);
  const { colors } = useTheme();

  if (localStream && !remoteStream) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <CallToolbar />
      </View>
    );
  }

  if (localStream && remoteStream) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <RTCView
          streamURL={remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          style={styles.videoLocal}
        />
        <CallToolbar />
      </View>
    );
  }
};

export default VideoCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoLocal: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 24,
    right: 24,
  },
});
