let app;

function main() {
    app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            cameras: [],
            camera: null,
            stream: null
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
            stream(){
                getCameras(this.cameras)
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


    let square = new cv.Rect(0, 0, a, a);


    function processVideo() {
        try {
            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow("canvasOutput", dst);
            cv.imshow("roi", dst.roi(square))

            requestAnimationFrame(processVideo)
        } catch (err) {
            console.error(err);
        }
    }

    // schedule the first one.
    processVideo()
}