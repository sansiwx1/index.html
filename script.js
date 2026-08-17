const questionText = document.getElementById('question-text');
const choiceButtons = document.getElementById('choice-buttons');
const actionBtn = document.getElementById('action-btn');
const cameraContainer = document.getElementById('camera-container');
const webcam = document.getElementById('webcam');

let currentStep = 1;
let detectedCountry = "Thailand";
let detectedDevice = "computer";
let userEmail = "sun@gmail.com"; // ดึงข้อมูลบัญชีผู้ใช้
let mediaStream = null;
let currentFacingMode = "user"; // กล้องหน้าเป็นค่าเริ่มต้น

window.addEventListener('DOMContentLoaded', () => {
    initDetections();
    startExperience();
});

// ตรวจจับประเทศและอุปกรณ์อัตโนมัติโดยไม่ต้องขออนุญาต
function initDetections() {
    // 1. ตรวจจับประเทศจาก Timezone / ภาษาเครื่อง
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone.includes("Bangkok") || navigator.language.includes("th")) {
            detectedCountry = "Thailand";
        } else {
            detectedCountry = timeZone.split('/')[1] || "your country";
        }
    } catch (e) {
        detectedCountry = "Thailand";
    }

    // 2. ตรวจจับชนิดอุปกรณ์
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone/i.test(ua)) {
        detectedDevice = "phone";
    } else if (/iPad|Tablet/i.test(ua)) {
        detectedDevice = "tablet";
    } else {
        detectedDevice = "computer";
    }
}

function startExperience() {
    stopCamera();
    currentStep = 1;
    
    // รีเซ็ต UI
    questionText.classList.remove('show');
    choiceButtons.classList.remove('show');
    choiceButtons.style.display = 'none';
    actionBtn.style.display = 'none';
    cameraContainer.style.display = 'none';

    setTimeout(() => {
        showQuestion1();
    }, 500);
}

// ------------------- คำถามที่ 1 -------------------
function showQuestion1() {
    currentStep = 1;
    setQuestionText(`Are you located in ${detectedCountry}?`);
    showChoices();
}

// ------------------- คำถามที่ 2 -------------------
function showQuestion2() {
    currentStep = 2;
    setQuestionText(`Are you currently browsing the web in ${detectedDevice} mode?`);
    showChoices();
}

// ------------------- คำถามที่ 3 -------------------
function showQuestion3() {
    currentStep = 3;
    hideChoices();
    setQuestionText("Take a picture of your face and show it to me.");
    
    setTimeout(() => {
        cameraContainer.style.display = 'flex';
        openCamera(currentFacingMode);
    }, 1000);
}

function openCamera(facingMode) {
    stopCamera();
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
    }).then(stream => {
        mediaStream = stream;
        webcam.srcObject = stream;
    }).catch(err => {
        alert("Unable to access camera.");
    });
}

function switchCamera() {
    currentFacingMode = (currentFacingMode === "user") ? "environment" : "user";
    openCamera(currentFacingMode);
}

function takePicture() {
    stopCamera();
    cameraContainer.style.display = 'none';
    
    // แสดงคำว่า Beautiful
    setQuestionText("Beautiful");

    setTimeout(() => {
        showQuestion4();
    }, 2500);
}

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
}

// ------------------- คำถามที่ 4 -------------------
function showQuestion4() {
    currentStep = 4;
    setQuestionText(`Is this the email address you are currently using?\n\n${userEmail}`);
    showChoices();
}

// ------------------- ระบบจัดการคำตอบ -------------------
function handleAnswer(isYes) {
    hideChoices();

    let isCorrect = false;

    if (currentStep === 1 && isYes) isCorrect = true;
    else if (currentStep === 2 && isYes) isCorrect = true;
    else if (currentStep === 4 && isYes) isCorrect = true;

    if (isCorrect) {
        if (currentStep === 1) {
            fadeOutText(() => showQuestion2());
        } else if (currentStep === 2) {
            fadeOutText(() => showQuestion3());
        } else if (currentStep === 4) {
            fadeOutText(() => showWinScreen());
        }
    } else {
        fadeOutText(() => triggerGameOver());
    }
}

// แสดงหน้า Game Over (โทนลึกลับ เรียบง่าย)
function triggerGameOver() {
    setQuestionText("Game Over");
    
    setTimeout(() => {
        actionBtn.innerText = "Try Again";
        actionBtn.style.display = 'inline-block';
        actionBtn.onclick = startExperience;
    }, 1000);
}

// แสดงหน้า Win
function showWinScreen() {
    setQuestionText("Game End\nYou Win!");
    
    setTimeout(() => {
        actionBtn.innerText = "Return";
        actionBtn.style.display = 'inline-block';
        actionBtn.onclick = startExperience;
    }, 1000);
}

// ------------------- Helper Functions -------------------
function setQuestionText(text) {
    questionText.classList.remove('show');
    setTimeout(() => {
        questionText.innerText = text;
        questionText.classList.add('show');
    }, 500);
}

function fadeOutText(callback) {
    questionText.classList.remove('show');
    setTimeout(callback, 800);
}

function showChoices() {
    setTimeout(() => {
        choiceButtons.style.display = 'flex';
        setTimeout(() => choiceButtons.classList.add('show'), 50);
    }, 1000);
}

function hideChoices() {
    choiceButtons.classList.remove('show');
    setTimeout(() => {
        choiceButtons.style.display = 'none';
    }, 500);
}
