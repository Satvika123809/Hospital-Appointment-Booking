// Check if the browser supports the required API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("Camera supported!");
} else {
    alert("Camera not supported on this browser.");
}

let video = document.getElementById('video');

// Start the video stream from the user's camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            document.getElementById('error').textContent = "Unable to access the camera.";
            console.log("Error accessing the camera: ", error);
        });
}

// Start face recognition process
function startFaceRecognition() {
    // Initialize the face recognition library (you can use libraries like face-api.js)
    const faceapi = require('face-api.js'); // assuming Node.js environment, if client-side add via CDN
    
    startCamera();

    video.addEventListener('play', async () => {
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptors();
        if (detections) {
            console.log("Face detected", detections);
            // Send the face descriptor to the backend for comparison with the stored data
            fetch('/recognize-face', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    faceDescriptor: detections.descriptor
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Face recognized successfully!");
                    // Handle success login action, e.g., redirect or display user info
                } else {
                    document.getElementById('error').textContent = "Face not recognized.";
                }
            })
            .catch(err => console.error("Error recognizing face: ", err));
        }
    });
}

// Close the face modal
function closeFaceModal() {
    document.getElementById('faceModal').style.display = 'none';
}
