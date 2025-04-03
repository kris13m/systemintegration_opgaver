import './style.css' // https://systemintegration-opgaver.vercel.app/ <- kører her

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAkDBapaWD9k9RDLZo4Tq4V039oqUyjso",
  authDomain: "webrtc-de6f9.firebaseapp.com",
  projectId: "webrtc-de6f9",
  storageBucket: "webrtc-de6f9.firebasestorage.app",
  messagingSenderId: "810189664570",
  appId: "1:810189664570:web:8d47c199697080d9686003"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// html elements
const localVideo = document.getElementById("localvideo");
const remoteVideo = document.getElementById("remoteVideo");


// global state
const GLOBAL_ID = "GLOBAL_ID"
let localstream;
let remotestream;
let peerConnection;

const servers = {
  iceServers: [
      {
          urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
          ],
      },
],
};

async function startCall() {
  console.log("starting call")
  const callDocument = firestore.collection("calls").doc(GLOBAL_ID);
  const offerCandidates = callDocument.collection("offerCandidates");
  const answerCandidates = callDocument.collection("answerCandidates");

  localstream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localstream;

  remotestream = new MediaStream();
  remoteVideo.srcObject = remotestream;

  peerConnection = new RTCPeerConnection(servers);

  localStream.getTracks().forEach((track) => remoteStream.addTrack(track, localStream));

  // listen to remote tracks from the peer
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  peerConnection.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  await callDocument.set({ offer: { sdp: offerDescription.sdp, type: offerDescription.type } })

  callDocument.onSnapshot((snapshot) => {
		const data = snapshot.data();
		if (!peerConnection.currentRemoteDescription && data?.answer) {
			const answerDescription = new RTCSessionDescription(data.answer);
			peerConnection.setRemoteDescription(answerDescription);
		}
	});

	answerCandidates.onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === "added") {
				const candidate = new RTCIceCandidate(change.doc.data());
				if (peerConnection.remoteDescription) {
					peerConnection.addIceCandidate(candidate);
				}
			}
		});
	});
}

async function answerCall() {
	const callDocument = firestore.collection("calls").doc(GLOBAL_ID);
	const offerCandidates = callDocument.collection("offerCandidates");
	const answerCandidates = callDocument.collection("answerCandidates");

	peerConnection = new RTCPeerConnection(servers);

	peerConnection.onicecandidate = (event) => {
		event.candidate && answerCandidates.add(event.candidate.toJSON());
	};

	localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
	localVideo.srcObject = localStream;

	remoteStream = new MediaStream();
	remoteVideo.srcObject = remoteStream;

	localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

	peerConnection.ontrack = (event) => {
		event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
	};

	const callSnapshot = await callDocument.get();
	if (!callSnapshot.exists || !callSnapshot.data()?.offer) {
		console.error("No offer found.");
		return;
	}

	await peerConnection.setRemoteDescription(new RTCSessionDescription(callSnapshot.data().offer));

	const answerDescription = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answerDescription);
	await callDocument.update({ answer: { type: answerDescription.type, sdp: answerDescription.sdp } });

	offerCandidates.onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === "added") {
				peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
			}
		});
	});
}

document.getElementById("startCall").addEventListener("click", startCall);
document.getElementById("answerCall").addEventListener("click", answerCall);