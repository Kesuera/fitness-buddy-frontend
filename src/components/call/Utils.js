import { mediaDevices } from 'react-native-webrtc';

// source code: https://www.youtube.com/watch?v=pv3UHYwgxnM&t=795s
export default class Utils {
  static async getStream() {
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(
      device => device.kind === 'videoinput' && device.facing === facing
    );
    const facingMode = isFront ? 'user' : 'environment';

    const stream = mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId,
      },
      facingMode,
      optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
    });
    if (typeof stream != 'boolean') return stream;
    return null;
  }
}
