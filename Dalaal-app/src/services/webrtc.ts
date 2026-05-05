import { socketService } from './socket';

type WebRTCServiceEvent =
  | 'localStream'
  | 'remoteStream'
  | 'connectionStateChange'
  | 'error';

interface WebRTCServiceCallback {
  (event: 'localStream', stream: any): void;
  (event: 'remoteStream', stream: any): void;
  (event: 'connectionStateChange', state: any): void;
  (event: 'error', error: Error): void;
}

class WebRTCService {
  private listeners: Map<WebRTCServiceEvent, Set<Function>> = new Map();
  private isSupported: boolean = false;
  private peerConnection: any = null;
  private localStream: any = null;
  private remoteStream: any = null;
  private currentCallId: string | null = null;
  private currentConversationId: string | null = null;
  private targetUserId: string | null = null;

  private readonly iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  constructor() {
    try {
      require('react-native-webrtc');
      this.isSupported = true;
      this.setupSocketListeners();
    } catch (e) {
      console.warn('react-native-webrtc not available, WebRTC disabled');
      this.isSupported = false;
    }
  }

  private setupSocketListeners() {
    socketService.onWebRTCOffer(this.handleIncomingOffer.bind(this));
    socketService.onWebRTCAnswer(this.handleIncomingAnswer.bind(this));
    socketService.onWebRTCIceCandidate(this.handleIncomingIceCandidate.bind(this));
  }

  private emit<T extends WebRTCServiceEvent>(event: T, ...args: any[]) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
  }

  on<T extends WebRTCServiceEvent>(event: T, callback: WebRTCServiceCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off<T extends WebRTCServiceEvent>(event: T, callback?: WebRTCServiceCallback) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  async initialize(
    callId: string,
    conversationId: string,
    targetUserId: string,
    mode: 'audio' | 'video',
  ) {
    if (!this.isSupported) {
      console.warn('WebRTC not supported in this environment');
      return;
    }

    const { RTCPeerConnection, mediaDevices } = require('react-native-webrtc');
    this.currentCallId = callId;
    this.currentConversationId = conversationId;
    this.targetUserId = targetUserId;

    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers,
      });

      this.peerConnection.onicecandidate = (event: any) => {
        if (event.candidate && this.targetUserId && this.currentCallId && this.currentConversationId) {
          socketService.sendWebRTCIceCandidate({
            callId: this.currentCallId,
            conversationId: this.currentConversationId,
            candidate: event.candidate,
            targetUserId: this.targetUserId,
          });
        }
      };

      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection) {
          this.emit('connectionStateChange', this.peerConnection.connectionState);
        }
      };

      this.peerConnection.ontrack = (event: any) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.emit('remoteStream', this.remoteStream);
        }
      };

      await this.getLocalStream(mode, mediaDevices);

      if (this.localStream) {
        this.localStream.getTracks().forEach((track: any) => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, this.localStream!);
          }
        });
      }

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      this.emit('error', error as Error);
    }
  }

  private async getLocalStream(mode: 'audio' | 'video', mediaDevices: any) {
    const constraints: any = {
      audio: true,
      video: mode === 'video' ? { facingMode: 'user' } : false,
    };

    try {
      this.localStream = await mediaDevices.getUserMedia(constraints);
      this.emit('localStream', this.localStream);
    } catch (error) {
      console.error('Error getting local stream:', error);
      this.emit('error', error as Error);
    }
  }

  async createOffer() {
    if (!this.isSupported) {
      console.warn('WebRTC not supported');
      return;
    }

    if (!this.peerConnection || !this.targetUserId || !this.currentCallId || !this.currentConversationId) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      socketService.sendWebRTCOffer({
        callId: this.currentCallId,
        conversationId: this.currentConversationId,
        offer: this.peerConnection.localDescription,
        targetUserId: this.targetUserId,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      this.emit('error', error as Error);
    }
  }

  private async handleIncomingOffer(data: { callId: string; conversationId: string; offer: any }) {
    if (!this.isSupported) {
      return;
    }

    const { RTCSessionDescription } = require('react-native-webrtc');
    if (!this.peerConnection) {
      console.warn('Peer connection not initialized for incoming offer');
      return;
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      if (this.targetUserId && this.currentCallId && this.currentConversationId) {
        socketService.sendWebRTCAnswer({
          callId: this.currentCallId,
          conversationId: this.currentConversationId,
          answer: this.peerConnection.localDescription,
          targetUserId: this.targetUserId,
        });
      }
    } catch (error) {
      console.error('Error handling incoming offer:', error);
      this.emit('error', error as Error);
    }
  }

  private async handleIncomingAnswer(data: { callId: string; conversationId: string; answer: any }) {
    if (!this.isSupported) {
      return;
    }

    const { RTCSessionDescription } = require('react-native-webrtc');
    if (!this.peerConnection) {
      console.warn('Peer connection not initialized for incoming answer');
      return;
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (error) {
      console.error('Error handling incoming answer:', error);
      this.emit('error', error as Error);
    }
  }

  private async handleIncomingIceCandidate(data: { callId: string; conversationId: string; candidate: any }) {
    if (!this.isSupported) {
      return;
    }

    const { RTCIceCandidate } = require('react-native-webrtc');
    if (!this.peerConnection || !data.candidate) {
      return;
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  toggleAudio(enabled: boolean) {
    if (!this.isSupported) {
      return;
    }
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track: any) => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled: boolean) {
    if (!this.isSupported) {
      return;
    }
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track: any) => {
        track.enabled = enabled;
      });
    }
  }

  switchCamera() {
    if (!this.isSupported) {
      return;
    }
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach((track: any) => {
          const anyTrack = track as any;
          if (anyTrack._switchCamera) {
            anyTrack._switchCamera();
          }
        });
      }
    }
  }

  cleanup() {
    if (!this.isSupported) {
      return;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => {
        track.stop();
      });
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.currentCallId = null;
    this.currentConversationId = null;
    this.targetUserId = null;
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}

export const webRTCService = new WebRTCService();
