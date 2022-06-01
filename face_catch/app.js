const video = document.getElementById("video");
/* 获取摄像头权限，把视频内容展现在网页上 */
const startVideo = () => {
    navigator.getUserMedia(
        { video: {} },
        (stream) => { video.srcObject = stream },
        (err) => { console.log(err) }
    )
}
/* 引入faceapi资源 */
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo());
/* 监听人物动作 */
video.addEventListener("play", () => {
    /* 添加canvas绘图 */
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
        /*   width: video.width,
          height: video.height, */
        width: 700,
        height: 500
    };
    faceapi.matchDimensions(canvas, displaySize);
    /* 把数据填入canvas当中 */
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        //console.log(detections)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // draw detections into the canvas
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    }, 100);
})