window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}

async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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


