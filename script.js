// ข้อมูลผู้ใช้จำลองเริ่มต้นสำหรับ Leaderboard
let currentMode = 'rich'; // 'rich' หรือ 'beauty'
let currentUser = {
    name: "Guest User",
    email: "",
    avatar: "https://via.placeholder.com/100",
    flag: "🇹🇭",
    richScore: 88,
    beautyScore: 92,
    isLoggedIn: false
};

// ฐานข้อมูล mock up ของอันดับแข่งขัน
const mockLeaderboardData = {
    rich: [
        { name: "Elon Musk", avatar: "https://i.pravatar.cc/150?img=12", flag: "🇺🇸", score: 99 },
        { name: "Alexandre A.", avatar: "https://i.pravatar.cc/150?img=33", flag: "🇫🇷", score: 96 },
        { name: "Satoshi N.", avatar: "https://i.pravatar.cc/150?img=60", flag: "🇯🇵", score: 94 },
        { name: "Somchai Pro", avatar: "https://i.pravatar.cc/150?img=11", flag: "🇹🇭", score: 85 }
    ],
    beauty: [
        { name: "K-Pop Idol", avatar: "https://i.pravatar.cc/150?img=5", flag: "🇰🇷", score: 98 },
        { name: "Model Maya", avatar: "https://i.pravatar.cc/150?img=9", flag: "🇬🇧", score: 95 },
        { name: "Kenji Vance", avatar: "https://i.pravatar.cc/150?img=68", flag: "🇯🇵", score: 91 },
        { name: "Narisara", avatar: "https://i.pravatar.cc/150?img=20", flag: "🇹🇭", score: 89 }
    ]
};

window.addEventListener('DOMContentLoaded', () => {
    renderLeaderboard();
});

// ฟังก์ชั่นสลับหน้าความแข่งขัน (รวย / หล่อสวย)
function switchMode(mode) {
    currentMode = mode;
    document.getElementById('btn-mode-rich').classList.toggle('active', mode === 'rich');
    document.getElementById('btn-mode-beauty').classList.toggle('active', mode === 'beauty');
    
    document.getElementById('board-title').innerText = mode === 'rich' 
        ? '🏆 อันดับความรวยสูงสุด' 
        : '✨ อันดับความหล่อสวยสูงสุด';
        
    renderLeaderboard();
}

// ประมวลผลและแสดงรายการ Leaderboard
function renderLeaderboard() {
    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = '';

    // รวมข้อมูล User ปัจจุบันเข้าไปคำนวณอันดับด้วย (หากล็อกอินอยู่)
    let currentData = [...mockLeaderboardData[currentMode]];
    
    if (currentUser.isLoggedIn) {
        currentData.push({
            name: currentUser.name,
            avatar: currentUser.avatar,
            flag: currentUser.flag,
            score: currentMode === 'rich' ? currentUser.richScore : currentUser.beautyScore,
            isSelf: true
        });
    }

    // เรียงลำดับคะแนนจากมากไปน้อย
    currentData.sort((a, b) => b.score - a.score);

    // สร้าง Element ตาราง
    currentData.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (item.isSelf) tr.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';

        tr.innerHTML = `
            <td class="rank-badge">${index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}</td>
            <td class="user-cell">
                <img src="${item.avatar}" alt="${item.name}">
                <span>${item.name} ${item.isSelf ? '(คุณ)' : ''}</span>
            </td>
            <td style="font-size: 1.3rem;">${item.flag}</td>
            <td class="score-badge">${item.score} / 100</td>
        `;
        listContainer.appendChild(tr);
    });
}

// ฟังก์ชั่นจัดการเมื่อล็อกอินด้วย Google Login สำเร็จ
function handleCredentialResponse(response) {
    // ถอดรหัส JWT Token ของ Google เพื่อเอาข้อมูลโปรไฟล์
    const responsePayload = parseJwt(response.credential);

    currentUser.name = responsePayload.name;
    currentUser.email = responsePayload.email;
    currentUser.avatar = responsePayload.picture;
    currentUser.isLoggedIn = true;

    // สุ่มคะแนนประมวลผลให้ผู้ใช้ (0-100)
    currentUser.richScore = Math.floor(Math.random() * 20) + 80;
    currentUser.beautyScore = Math.floor(Math.random() * 20) + 80;

    // อัปเดต UI หน้าเว็บ
    document.getElementById('google-btn').style.display = 'none';
    document.getElementById('user-profile-bar').style.display = 'flex';
    document.getElementById('nav-user-avatar').src = currentUser.avatar;
    document.getElementById('nav-user-name').innerText = currentUser.name;
    
    // อัปเดตข้อมูลในหน้า Settings
    document.getElementById('setting-avatar').src = currentUser.avatar;
    document.getElementById('setting-name').innerText = currentUser.name;
    document.getElementById('setting-email').innerText = currentUser.email;
    document.getElementById('user-rich-score').innerText = currentUser.richScore;
    document.getElementById('user-beauty-score').innerText = currentUser.beautyScore;

    renderLeaderboard();
}

// แปลงสิทธิ์ Token JWT จาก Google
function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// เปลี่ยนธงชาติ
function updateCountryFlag() {
    const select = document.getElementById('country-select');
    currentUser.flag = select.value;
    document.getElementById('nav-user-flag').innerText = currentUser.flag;
    renderLeaderboard();
}

// สลับการแสดงผลระหว่างหน้า Leaderboard และ Settings
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}
