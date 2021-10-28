let app;

function main() {
    app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            cameras: [],
            camera: null,
            stream: null,
            flag: true,
            a: 0
        }
        , methods: {
            cam() {

                if (this.stream != null) {
                    this.stream.getTracks().forEach(item => item.stop())
                }
                // Grab elements, create settings, etc.
                let video = document.getElementById('video');
                // Get access to the camera!
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    // Not adding `{ audio: true }` since we only want video now
                    navigator.mediaDevices.getUserMedia({
                        //期望的deviceId，没有匹配的设备浏览器会给个默认设备
                        //使用exact可以强制指定设备描述
                        video: {deviceId: this.camera},
                        audio: false
                    }).then(function (stream1) {
                        //video.src = window.URL.createObjectURL(stream);
                        video.srcObject = stream1;
                        app.stream = stream1
                        video.play();
                        cvMain(video)
                    }).catch(e => {
                        console.log(e)
                        alert("摄像头打开失败")
                    });
                }
            }
        }, watch: {
            stream(newStream) {
                if (this.flag) {
                    this.flag = false
                    getCameras(this.cameras)
                    this.camera = newStream.getVideoTracks()[0].getSettings().deviceId
                }
            }
        }, computed: {
            cameraWidth() {
                try {
                    return this.stream.getVideoTracks()[0].getSettings().width
                } catch (e) {
                }
            },
            cameraHeight() {
                try {
                    return this.stream.getVideoTracks()[0].getSettings().height
                } catch (e) {
                }
            }
        }
    })
    if (!isSupportCamera()) {
        alert("打开摄像头失败！")
        return
    }
    if (!isSupportWebAssembly()) {
        alert("浏览器不支持WebAssembly！")
        return
    }
    debug("初始化完成")
    app.cam()


}

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js加载成功';
    cv['onRuntimeInitialized'] = () => {
        main()
    }
}

function cvMain(video) {

    video.width = app.cameraWidth
    video.height = app.cameraHeight
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    //get a  square
    let a = Math.min(app.cameraWidth, app.cameraHeight)
    this.a = a


    let square = new cv.Rect(0, 0, a, a);

    let p1  = new cv.Point(a*0.125, a*0.125);
    let p2  = new cv.Point(a*0.375, a*0.125);
    let p3  = new cv.Point(a*0.625, a*0.125);
    let p4  = new cv.Point(a*0.875, a*0.125);
    let p5  = new cv.Point(a*0.875, a*0.375);
    let p6  = new cv.Point(a*0.875, a*0.625);
    let p7  = new cv.Point(a*0.875, a*0.875);
    let p8  = new cv.Point(a*0.625, a*0.875);
    let p9  = new cv.Point(a*0.375, a*0.875);
    let p10  = new cv.Point(a*0.125, a*0.875);
    let p11  = new cv.Point(a*0.125, a*0.625);
    let p12  = new cv.Point(a*0.125, a*0.375);





    let gray = [0, 255, 0, 255]

    function processVideo() {
        try {
            cap.read(src);
            let roi = src.roi(square);
            cv.line(roi, p1, p4, [0, 255, 0, 100], 5)
            cv.line(roi, p4, p7, [0, 255, 0, 100], 5)
            cv.line(roi, p7, p10, [0, 255, 0, 100], 5)
            cv.line(roi, p10, p1, [0, 255, 0, 100], 5)
            cv.line(roi, p12, p5, [0, 255, 0, 100], 5)
            cv.line(roi, p11, p6, [0, 255, 0, 100], 5)
            cv.line(roi, p2, p9, [0, 255, 0, 100], 5)
            cv.line(roi, p3, p8, [0, 255, 0, 100], 5)

            for (let i = 0; i < 100; i++) {
                roi.ucharPtr(i,i)[0]=255
            }

            cv.imshow("roi", roi)

            requestAnimationFrame(processVideo)
        } catch (err) {
            console.error(err);
        }
    }

    // schedule the first one.
    processVideo()
}