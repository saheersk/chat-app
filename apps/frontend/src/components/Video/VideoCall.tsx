// VideoCall.js
import { useRef, useEffect, useState } from 'react';

const VideoCall = () => {
    const webSocketRef = useRef<WebSocket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>(); 

//     const initiateCall = async () => {

//         console.log(peerConnection, 'peer');
        
//     // Create an offer
//     const offer = await peerConnection?.createOffer();
//     // Set the local description
//     await peerConnection?.setLocalDescription(offer);

//     console.log(offer, "offer");
    
//     // Send the offer to the other user
//     webSocketRef.current?.send(JSON.stringify({ type: 'offer', offer: offer }));
//   };


  useEffect(() => {
    console.log("useEffect called");

    
    const initializeWebRTC = async () => {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current!.srcObject = stream;

        console.log(stream, localVideoRef.current, "local");
        

        const pc: any = new RTCPeerConnection({
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }, // Example STUN server
            ],
          });
          console.log(pc, "peerConnection");
          
          pc.addStream(stream);
            setPeerConnection(pc);

          console.log(pc, "peerConnection 2");



        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            console.log(event.candidate, "event");
            console.log(webSocketRef.current, "websocket");
            
            if (event.candidate) {
                if (webSocketRef.current) {
                    webSocketRef.current.send(
                        JSON.stringify({ type: 'ice-candidate', candidate: event.candidate })
                    );
                }
            }
        };

        pc.onaddstream = (event: any) => {
            if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.stream;
            }
        };

        pc.onnegotiationneeded = async () => {
            // This is triggered when you need to negotiate a connection, e.g., when creating an offer
            console.log('Negotiation needed');


          console.log(pc, 'peer');
        
          // Create an offer
          const offer = await pc?.createOffer();
          // Set the local description
          await pc?.setLocalDescription(offer);
      
          console.log(offer, "offer");
          
          // Send the offer to the other user
          webSocketRef.current?.send(JSON.stringify({ type: 'offer', offer }));

          };
    };

    const initializeWebSocket = () => {
        const ws = new WebSocket("ws://localhost:8000/ws/video/video_call/");
      
        ws.addEventListener('open', () => {
          console.log("WebSocket connected");
          webSocketRef.current = ws;
          console.log(webSocketRef.current, 'ws ref');
          
          initializeWebRTC();
        });
      
        ws.addEventListener('message', (event) => {
          handleData(event.data);
        });
      
        ws.addEventListener('close', () => {
          console.log("WebSocket closed");
          webSocketRef.current = null;
        });
      };
      
      initializeWebSocket();

      console.log(webSocketRef.current, "ws");
      

    if (webSocketRef.current) {
        webSocketRef.current.onopen = () => {
          console.log('WebSocket connected ref');
          // Call initializeWebRTC after WebSocket connection is open
          initializeWebRTC();
        };
      } else {
        console.log('WebSocket not available');
      }
    // Clean up when the component unmounts
    return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
        if (peerConnection) {
          peerConnection.close();
        }
      };
  }, []);

  const handleData = (message: any) => {
      const data = JSON.parse(message);
      console.log(message, "data");
    
    if (data.type === 'offer') {
      handleOffer(data.offer);
    } else if (data.type === 'answer') {
      handleAnswer(data.answer);
    } else if (data.type === 'ice-candidate') {
      handleICECandidate(data.candidate);
    }
  };

  const handleOffer = async (offer: any) => {
    await peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection?.createAnswer();
    await peerConnection?.setLocalDescription(answer);

    webSocketRef.current?.send(JSON.stringify({ type: 'answer', answer }));

  };

  const handleAnswer = async (answer: any) => {
    await peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleICECandidate = async (candidate: any) => {
    await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
