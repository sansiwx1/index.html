const emojiEl = document.getElementById('emoji');
const messageText = document.getElementById('message-text');
const questionButtons = document.getElementById('question-buttons');
const actionBtn = document.getElementById('action-btn');

let detectedCountry = "Thailand"; // ค่าเริ่มต้นสำหรับกรณีดึงชื่อประเทศสำเร็จ
let isLocationVerified = false;
let timeouts = []; // ใช้เก็บ Timeout ทั้งหมดเพื่อล้างค่าตอน Reset ป้องกันบั๊กกดซ้ำ

window.addEventListener('DOMContentLoaded', () => {
    resetAndStart();
});

// ฟังก์ชั่นสำหรับเคลียร์ Timeout ทั้งหมดเพื่อป้องกันบั๊ก
function clearAllTimeouts() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
}

function safeTimeout(fn, delay) {
    const t = setTimeout(fn, delay);
    timeouts.push(t);
    return t;
}

function resetAndStart() {
    clearAllTimeouts();

    // ล้างสถานะ UI ทั้งหมด
    document.body.className = '';
    messageText.innerText = '';
    messageText.style.display = 'none';
    questionButtons.style.display = 'none';
    actionBtn.style.display = 'none';

    emojiEl.innerText = '😀';
    emojiEl.style.display = 'block';
    emojiEl.className = 'emoji';

    // 1. ค่อยๆ ปรากฏอิโมจิขึ้นมากลางจอ
    safeTimeout(() => {
        emojiEl.classList.add('fade-in');

        // 2. ขออนุญาตเปิดกล้องและขออนุญาตตำแหน่งพร้อมกัน
        safeTimeout(() => {
            requestPermissions();
        }, 1500);
    }, 300);
}

function requestPermissions() {
    let cameraGranted = false;
    let locationGranted = false;

    // ขอสิทธิ์กล้องของเบราว์เซอร์
    const cameraPromise = navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => { cameraGranted = true; })
        .catch(() => { cameraGranted = false; });

    // ขอสิทธิ์ตำแหน่งของเบราว์เซอร์
    const locationPromise = new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                locationGranted = true;
                // ดึงชื่อประเทศจากภาษาของระบบเบราว์เซอร์ (สามารถปรับแต่งเพิ่มเติมได้)
                const userLang = navigator.language || navigator.userLanguage;
                if (userLang.includes('th')) detectedCountry = "Thailand";
                else detectedCountry = "your location";
                
                resolve(true);
            },
            () => {
                locationGranted = false;
                resolve(false);
            }
        );
    });

    // รอให้ผู้ใช้ตอบรับทั้งสอง popup จากระบบ
    Promise.all([cameraPromise, locationPromise]).then(() => {
        if (cameraGranted && locationGranted) {
            handleSuccessPermission();
        } else {
            handleDeniedPermission();
        }
    });
}

// กรณีอนุญาตทั้งกล้องและตำแหน่ง
function handleSuccessPermission() {
    emojiEl.innerText = '😁';
    isLocationVerified = true;

    // อิโมจิยิ้มแป๊บนึง แล้วค่อยๆ หายไป
    safeTimeout(() => {
        emojiEl.classList.remove('fade-in');
        emojiEl.classList.add('fade-out');

        safeTimeout(() => {
            emojiEl.style.display = 'none';
            showQuestion();
        }, 1500);
    }, 1500);
}

// ค่อยๆ มีคำถามโผล่ขึ้นมา
function showQuestion() {
    messageText.innerText = `Are you located in ${detectedCountry}?`;
    messageText.style.display = 'block';
    questionButtons.style.display = 'flex';
}

// ตอบคำถาม Yes/No
function answerQuestion(isYes) {
    questionButtons.style.display = 'none';

    if (isYes && isLocationVerified) {
        // หากกด Yes และระบบตรวจเจอว่าอยู่จริง
        messageText.innerText = "Game End\nYou Win!";
        actionBtn.innerText = "Return";
        actionBtn.className = "btn btn-choice";
        actionBtn.style.display = 'inline-block';
    } else {
        // หากตอบ No หรือระบบไม่พบการยืนยันตัวตน ให้ตัดไปหน้าสั่น
        triggerScareSequence();
    }
}

// กรณีไม่อนุญาต (กด Deny กล้อง หรือ ตำแหน่ง)
function handleDeniedPermission() {
    emojiEl.innerText = '😶';
    
    safeTimeout(() => {
        emojiEl.classList.remove('fade-in');
        emojiEl.classList.add('fade-out');

        safeTimeout(() => {
            emojiEl.style.display = 'none';
            triggerScareSequence();
        }, 1500);
    }, 1000);
}

// เอฟเฟกต์หน้าจอสั่นและจอแดง
function triggerScareSequence() {
    document.body.classList.add('shake-screen', 'red-screen');
    
    messageText.innerText = "Why don't you allow it?";
    messageText.style.display = 'block';

    safeTimeout(() => {
        messageText.innerText = "Game over. Try again.";

        safeTimeout(() => {
            actionBtn.innerText = "Try Again";
            actionBtn.className = "btn btn-action";
            actionBtn.style.display = 'inline-block';
            actionBtn.onclick = resetAndStart; // ปุ่มสั่งเริ่มใหม่
        }, 1000);

    }, 2000);
}
