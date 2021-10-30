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
    let cap = new cv.VideoCapture(video);

    //get a  square
    let a = Math.min(app.cameraWidth, app.cameraHeight)
    this.a = a
    let dst = new cv.Mat(a, a, cv.CV_8UC3);


    let square = new cv.Rect(0, 0, a, a);

    let p = [
        new cv.Point(a * 0.125, a * 0.125),
        new cv.Point(a * 0.375, a * 0.125),
        new cv.Point(a * 0.625, a * 0.125),
        new cv.Point(a * 0.875, a * 0.125),
        new cv.Point(a * 0.875, a * 0.375),
        new cv.Point(a * 0.875, a * 0.625),
        new cv.Point(a * 0.875, a * 0.875),
        new cv.Point(a * 0.625, a * 0.875),
        new cv.Point(a * 0.375, a * 0.875),
        new cv.Point(a * 0.125, a * 0.875),
        new cv.Point(a * 0.125, a * 0.625),
        new cv.Point(a * 0.125, a * 0.375),
    ]


    let b = [
        new cv.Point(a * 0.25, a * 0.25),
        new cv.Point(a * 0.25, a * 0.50),
        new cv.Point(a * 0.25, a * 0.75),
        new cv.Point(a * 0.50, a * 0.25),
        new cv.Point(a * 0.50, a * 0.50),
        new cv.Point(a * 0.50, a * 0.75),
        new cv.Point(a * 0.75, a * 0.25),
        new cv.Point(a * 0.75, a * 0.50),
        new cv.Point(a * 0.75, a * 0.75),
    ]


    let d = document.getElementById("debug");


    let gray = [0, 255, 0, 255]

    function processVideo() {
        try {
            cap.read(src);
            let roi = src.roi(square);
            cv.line(roi, p[0], p[3], [0, 255, 0, 100], 5)
            cv.line(roi, p[3], p[6], [0, 255, 0, 100], 5)
            cv.line(roi, p[6], p[9], [0, 255, 0, 100], 5)
            cv.line(roi, p[9], p[0], [0, 255, 0, 100], 5)
            cv.line(roi, p[11], p[4], [0, 255, 0, 100], 5)
            cv.line(roi, p[10], p[5], [0, 255, 0, 100], 5)
            cv.line(roi, p[1], p[8], [0, 255, 0, 100], 5)
            cv.line(roi, p[2], p[7], [0, 255, 0, 100], 5)


            // console.log(color)


            // cv.cvtColor(roi, dst, cv.COLOR_RGB2HLS);
            let color = getColorList(roi, b[4], 3)
            let colorDistance1 = colorDistance(color);
            app.message=colorDistance1
            // document.getElementById("debug").style.backgroundColor=`rgb(${color[0][0]},${color[0][1]},${color[0][2]})`
            // debug(color)


            cv.imshow("roi", roi)

            requestAnimationFrame(processVideo)
        } catch (err) {
            console.error(err);
        }
    }

    // schedule the first one.
    processVideo()
}