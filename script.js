// รายการสินค้าตัวอย่าง
const products = [
    { id: 1, name: "หูฟังไร้สาย Gaming", price: 1290, image: "https://via.placeholder.com/250x180?text=Headset" },
    { id: 2, name: "คีย์บอร์ด Mechanical", price: 2490, image: "https://via.placeholder.com/250x180?text=Keyboard" },
    { id: 3, name: "เมาส์ไร้สาย Ergonomic", price: 890, image: "https://via.placeholder.com/250x180?text=Mouse" },
    { id: 4, name: "แผ่นรองเมาส์ RGB", price: 450, image: "https://via.placeholder.com/250x180?text=Mousepad" }
];

let cart = [];

// โหลดรายการสินค้าแสดงบนหน้าเว็บ
function renderProducts() {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h4 class="product-title">${product.name}</h4>
            <div class="product-price">฿${product.price.toLocaleString()}</div>
            <button class="btn-add" onclick="addToCart(${product.id})">เพิ่มลงตะกร้า</button>
        `;
        container.appendChild(card);
    });
}

// เพิ่มสินค้าลงตะกร้า
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
}

// อัปเดต UI ของตะกร้าสินค้า
function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.length;
    
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <span>${item.name}</span>
            <span>฿${item.price.toLocaleString()}</span>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    
    document.getElementById("total-price").innerText = total.toLocaleString();
}

// เปิด-ปิด Modal ตะกร้าสินค้า
function toggleCart() {
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

// ปุ่มชำระเงินตัวอย่าง
function checkout() {
    if (cart.length === 0) {
        alert("ตะกร้าสินค้าของคุณยังว่างอยู่");
        return;
    }
    alert("ขอบคุณสำหรับการสั่งซื้อ! (ระบบจำลอง)");
    cart = [];
    updateCartUI();
    toggleCart();
}

// เรียกทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", renderProducts);

