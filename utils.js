function isSupportWebAssembly() {
    return (() => {
        try {
            if (typeof WebAssembly === "object"
                && typeof WebAssembly.instantiate === "function") {
                const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                if (module instanceof WebAssembly.Module)
                    return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
            }
        } catch (e) {
        }
        return false;
    })()
}

function isSupportCamera() {
    return !(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices);
}

function getCameras(device_list) {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind === 'videoinput') {
                    device_list.push({label: device.label, deviceId: device.deviceId})
                    // if (device_list.length===1){
                    //     app.camera=device.deviceId
                    //     app.cam()
                    // }
                    console.log(device);
                }
            });
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
}

function debug(e){
    app.message+="\n"+e
}