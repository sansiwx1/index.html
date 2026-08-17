const emojiEl = document.getElementById('emoji');
const messageText = document.getElementById('message-text');
const retryBtn = document.getElementById('retry-btn');
const videoEl = document.getElementById('webcam-preview');

// เริ่มการทำงานเมื่อโหลดหน้าเว็บ
window.addEventListener('DOMContentLoaded', () => {
    startExperience();
});

function startExperience() {
    // รีเซ็ตสถานะหน้าเว็บกลับเป็นเริ่มต้น
    document.body.className = '';
    messageText.style.display = 'none';
    messageText.innerText = '';
    retryBtn.classList.remove('visible');
    retryBtn.style.display = 'none';
    
    emojiEl.innerText = '😀';
    emojiEl.className = 'emoji'; // ซ่อนก่อน

    // ค่อยๆ โผล่อิโมจิออกมา
    setTimeout(() => {
        emojiEl.classList.add('fade-in');
        
        // รออิโมจิแสดงผลเสร็จ แล้วจึงเรียกขออนุญาตเปิดกล้องระบบ (เบราว์เซอร์จริง)
        setTimeout(() => {
            requestCameraPermission();
        }, 2000);
    }, 500);
}

function requestCameraPermission() {
    // เรียกขอเปิดกล้องผ่านระบบของเบราว์เซอร์ (Google Chrome / System Permission)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                // กรณีผู้ใช้กด "อนุญาต" (Allow)
                videoEl.srcObject = stream;
                emojiEl.innerText = '😁';
            })
            .catch((err) => {
                // กรณีผู้ใช้กด "ไม่อนุญาต" (Block / Deny)
                handlePermissionDenied();
            });
    } else {
        alert('เบราว์เซอร์ของคุณไม่รองรับการใช้งานกล้อง');
    }
}

function handlePermissionDenied() {
    // เปลี่ยนเป็นหน้า 😶 แล้วค่อยๆ หายไป
    emojiEl.innerText = '😶';
    
    setTimeout(() => {
        emojiEl.classList.remove('fade-in');
        emojiEl.classList.add('fade-out');

        // หลังจากหายไป เริ่มสั่นแรงมากและเปลี่ยนพื้นหลังเป็นสีแดง
        setTimeout(() => {
            emojiEl.style.display = 'none';
            document.body.classList.add('shake-screen', 'red-screen');
            
            // แสดงข้อความ "Why don't you allow it?"
            messageText.innerText = "Why don't you allow it?";
            messageText.style.display = 'block';

            // ผ่านไป 2 วินาที เปลี่ยนเป็น "Game over. Try again."
            setTimeout(() => {
                messageText.innerText = "Game over. Try again.";

                // ค่อยๆ ปรากฏปุ่ม Try Again ขอบมนขึ้นมาในขณะที่จอยังสั่นสีแดงอยู่
                setTimeout(() => {
                    retryBtn.style.display = 'inline-block';
                    setTimeout(() => {
                        retryBtn.classList.add('visible');
                    }, 50);
                }, 1000);

            }, 2000);

        }, 1500);

    }, 1000);
}
