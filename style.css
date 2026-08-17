* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #000;
    color: #fff;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    overflow: hidden;
    transition: background-color 0.3s ease;
}

.main-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* เอฟเฟกต์ Fade-in สำหรับอิโมจิ */
.emoji {
    font-size: 8rem;
    opacity: 0;
    transition: opacity 2s ease, transform 0.5s ease;
    user-select: none;
}

.emoji.fade-in {
    opacity: 1;
}

.emoji.fade-out {
    opacity: 0;
}

/* ข้อความสยองขวัญ */
.message-text {
    font-size: 2.5rem;
    color: #fff;
    text-shadow: 0 0 10px #ff0000;
    margin-top: 20px;
    display: none;
}

/* ปุ่ม Try Again สี่เหลี่ยมขอบมน */
.retry-btn {
    display: none;
    margin-top: 30px;
    padding: 15px 40px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    background-color: #8b0000;
    border: 2px solid #ff0000;
    border-radius: 25px; /* ขอบมน */
    cursor: pointer;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
    transition: opacity 1.5s ease, transform 0.2s;
    opacity: 0;
}

.retry-btn.visible {
    display: inline-block;
    opacity: 1;
}

.retry-btn:hover {
    transform: scale(1.05);
    background-color: #ff0000;
}

/* เอฟเฟกต์หน้าจอสีแดง */
body.red-screen {
    background-color: #ff0000 !important;
}

/* เอฟเฟกต์สั่นแรงมาก (Shake Animation) */
.shake-screen {
    animation: intense-shake 0.05s infinite;
}

@keyframes intense-shake {
    0% { transform: translate(0, 0) rotate(0deg); }
    20% { transform: translate(-15px, 15px) rotate(-3deg); }
    40% { transform: translate(15px, -15px) rotate(3deg); }
    60% { transform: translate(-20px, -10px) rotate(-5deg); }
    80% { transform: translate(20px, 10px) rotate(5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
}
