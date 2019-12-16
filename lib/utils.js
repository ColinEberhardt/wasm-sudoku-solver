function checkFeatures(info, features) {
  var wasmSupported = true, webrtcSupported = true;
  if (features.webrtc) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      webrtcSupported = false;
    }
  }
  if (features.wasm && !window.WebAssembly) {
    wasmSupported = false;
  }

  if (!webrtcSupported || !wasmSupported) {
    var text = "Your web browser doesn't support ";
    var len = text.length;
    if (!webrtcSupported) {
      text += "WebRTC";
    }
    if (!wasmSupported) {
      if (text.length > len) {
        text += " and ";
      }
      text += "WebAssembly"
    }
    text += ".";
    info.innerHTML = text;
    return false;
  }

  return true;
}