"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [
    {
        normal: "#5468e7",
        dark: "#4353b9",
        light: "#98a4f1",
        veryLight: "#eef0fd"
    }, {
        normal: "#e94c2b",
        dark: "#ba3d22",
        veryLight: "#fdedea",
        light: "#f29480"
    }
];
// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
    document.documentElement.style.setProperty("--primary-light", colorTheme.light);
    document.documentElement.style.setProperty("--primary-dark", colorTheme.dark);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
let canvas;
let ctx;
let input;
const threshold = 0.7;
let model;

// Load trained model.
tf.loadGraphModel("https://models.lovesaroha.com/Object-Detector-Model/model.json").then(savedModel => {
    model = savedModel;
    document.getElementById("view_id").innerHTML = document.getElementById("homePage_id").innerHTML;
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
}).catch(e => { console.log(e); });

// This function guess based on canvas drawing.
window.predict = async function (el) {
    startButtonLoading(el);
    let output = await model.executeAsync({ image_tensor: input }, ['detection_scores', 'detection_boxes', 'detection_classes']);
    const scores = output[0].dataSync();
    const boxes = output[1].arraySync()[0]
    const classes = output[2].dataSync();
    // Show boxes.
    scores.forEach((score, i) => {
        if (score > threshold) {
            let label = labels[classes[i]];
            let x1 = boxes[i][1] * 512;
            let y1 = boxes[i][0] * 512;
            let x2 = boxes[i][3] * 512;
            let y2 = boxes[i][3] * 512;
            // Show rectangle box.
            ctx.beginPath();
            ctx.rect(x1, y1, x2 - x1, y2 - y1);
            ctx.strokeStyle = colorTheme.dark;
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();
            // Show label.
            ctx.fillStyle = colorTheme.dark;
            ctx.fillRect(x1, y1 - 30, x2 - x1, 30);
            ctx.font = "20px lsSans-Bold";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(label, x1 + 10, y1 - 10);
        }
    });
    stopButtonLoading(el);
}

// This function set background image.
function setBackgroundImage(el) {
    let file = el.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        let image = new Image();
        image.src = reader.result;
        image.onload = function (e) {
            ctx.drawImage(image, 0, 0, 512, 512);
            // Save input.
            input = tf.browser.fromPixels(image).expandDims();
            document.getElementById("predict_id").className = "";
        }
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}

//  Labels.
labels = [
    "--id-00--",
    "person",
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "--id-12--",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "--id-26--",
    "backpack",
    "umbrella",
    "--id-29--",
    "--id-30--",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "--id-45--",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "couch",
    "potted plant",
    "bed",
    "--id-66--",
    "dining table",
    "--id-68--",
    "--id-69--",
    "toilet",
    "--id-71--",
    "tv",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "--id-83--",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush"
];

// This function starts button loading effect.
function startButtonLoading(button) {
    button.disabled = true;
    button.innerHTML = `<i class="fad fa-spinner-third fa-spin"></i>`;
}

// This function stops button loading effect.
function stopButtonLoading(el) {
    el.disabled = false;
    el.innerHTML = "Predict";
}