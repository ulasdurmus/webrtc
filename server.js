const express = require('express');
const app = express();
//const fs = require('fs');
const http = require('http');
//const https = require('https');
const bodyParser = require('body-parser');
const webrtc = require("wrtc");

//app.get("/", function (req, res) {
//    res.send('HTTPS Server Response');
//    //res.redirect("https://" + req.headers.host + req.path);
//});

const port = process.env.PORT || 3000;

let senderStream;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};

//const optionSSL = {
//    key: fs.readFileSync("./ssl/key.pem"),
//    cert: fs.readFileSync("./ssl/cert.pem")
//};
//http.createServer(app).listen(port, function () {
//    console.log("Express Http server listenin on port 3000");
//})
//https.createServer(optionSSL, app).listen(3001, function () {
//    console.log("Express HTTP server listening on port 3001");
//});
////app.listen(5001, () => console.log('server started'));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});