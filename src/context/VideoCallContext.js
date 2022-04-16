import React, {
  useState,
  useRef,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './AuthContext';
import Utils from '../components/call/Utils';
import * as Navigation from '../components/navigation/NavigationRef';

// source code: https://www.youtube.com/watch?v=pv3UHYwgxnM&t=795s

export const VideoCallContext = createContext();

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

export const VideoCallProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [userInCall, setUserInCall] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef(null);
  const callId = useRef(null);
  const connecting = useRef(false);

  useEffect(() => {
    const subscribe = firestore()
      .collection('calls')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          const docId = change.doc.id;

          if (change.type === 'added') {
            if (
              data &&
              data.offer &&
              data.offer.calleeUsername === userInfo.username &&
              !connecting.current
            ) {
              setUserInCall(data.offer.callerFullname);
              callId.current = docId;
              Navigation.navigate('Getting call', {
                callPartner: data.offer.callerFullname,
              });
            }
          }

          if (callId.current === docId) {
            if (change.type === 'modified') {
              if (
                pc.current &&
                !pc.current.remoteDescription &&
                data &&
                data.answer
              ) {
                pc.current.setRemoteDescription(
                  new RTCSessionDescription(data.answer)
                );
              }
            }

            if (change.type === 'removed') {
              Navigation.pop();
              hangup();
            }
          }
        });
      });

    return () => {
      subscribe();
    };
  }, [userInfo]);

  const setupWebrtc = async calleeFullname => {
    pc.current = new RTCPeerConnection(configuration);

    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
      Navigation.navigate('Video call', { callPartner: calleeFullname });
    }

    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };
  };

  const create = async (calleeUsername, calleeFullname) => {
    connecting.current = true;

    await setupWebrtc(calleeFullname);

    const cRef = firestore().collection('calls').doc();
    callId.current = cRef.id;
    setUserInCall(calleeFullname);

    collectIceCandidates(cRef, 'caller', 'callee');

    if (pc.current) {
      const offer = await pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          callerUsername: userInfo.username,
          callerFullname: userInfo.full_name,
          calleeUsername: calleeUsername,
          calleeFullname: calleeFullname,
          type: offer.type,
          sdp: offer.sdp,
        },
      };

      cRef.set(cWithOffer);
    }
  };

  const join = async () => {
    connecting.current = true;
    Navigation.pop();

    const cRef = firestore().collection('calls').doc(callId.current);
    const offer = (await cRef.get()).data()?.offer;

    if (offer) {
      await setupWebrtc(offer.callerFullname);

      collectIceCandidates(cRef, 'callee', 'caller');

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        cRef.update(cWithAnswer);
      }
    }
  };

  // source code: https://github.com/Spectrumsun/Video-Call/blob/master/component/CallScreen.js
  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  // source code: https://github.com/Spectrumsun/Video-Call/blob/master/component/CallScreen.js
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream
      .getAudioTracks()
      .forEach(track => (track.enabled = !track.enabled));

    setIsMuted(!isMuted);
  };

  const hangup = async () => {
    connecting.current = false;
    Navigation.pop();
    streamCleanUp();
    firestoreCleanUp();
    if (pc.current) {
      pc.current.close();
    }
  };

  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const firestoreCleanUp = async () => {
    const cRef = firestore().collection('calls').doc(callId.current);
    callId.current = null;

    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });

      cRef.delete();
    }
  };

  const collectIceCandidates = async (cRef, localName, remoteName) => {
    const candidateCollection = cRef.collection(localName);

    if (pc.current) {
      pc.current.onicecandidate = event => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }

    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          if (pc.current) pc.current.addIceCandidate(candidate);
        }
      });
    });
  };

  return (
    <VideoCallContext.Provider
      value={{
        localStream,
        remoteStream,
        userInCall,
        isMuted,
        hangup,
        create,
        join,
        toggleMute,
        switchCamera,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
