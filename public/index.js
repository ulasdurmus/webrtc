window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}
const stream = null;
async function init() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    //const stream = await navigator.mediaDevices.getUserMedia({
    //    video: true,
    //    audio: {
    //        autoGainControl: false,
    //        channelCount: 2,
    //        echoCancellation: true,
    //        latency: 0,
    //        noiseSuppression: true,
    //        sampleRate: 48000,
    //        sampleSize: 24,
    //        volume: 1
    //    }
       
    //});
//const stream = await navigator.mediaDevices.getUserMedia({
//    audio: true,
//    video: {
//        width: {
//            max: 1280
//        },
//        height: {
//            max: 720
//        }
//    } });
document.getElementById("video").srcObject = stream;
    const peer = createPeer();
stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

//function toogleMute() {
//    for (let index in stream.getAudioTracks()) {
//        stream.getAudioTracks()[index].enabled = !stream.getAudioTracks()[index].enabled;
//        muteButton.innerText = stream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted";
//    }
//}
//function toogleVid() {
//    for (let index in stream.getVideoTracks()) {
//        stream.getVideoTracks()[index].enabled = !stream.getVideoTracks()[index].enabled;
//        videoButton.innerText = stream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled";
//    }
//}
