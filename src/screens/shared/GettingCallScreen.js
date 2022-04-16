import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Headline, useTheme } from 'react-native-paper';
import { VideoCallContext } from '../../context/VideoCallContext';

const GettingCallScreen = ({ route }) => {
  const { colors } = useTheme();
  const { join, hangup } = useContext(VideoCallContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.titleContainer}>
        <Headline style={{ color: 'white' }}>
          Call from {route.params.callPartner}
        </Headline>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="phone"
          color={colors.background}
          size={40}
          style={{ marginRight: 30, backgroundColor: 'green' }}
          onPress={() => {
            join();
          }}
        />
        <IconButton
          icon="phone-hangup"
          color={colors.background}
          size={40}
          style={{ marginLeft: 30, backgroundColor: colors.error }}
          onPress={() => {
            hangup();
          }}
        />
      </View>
    </View>
  );
};

export default GettingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: 24,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
