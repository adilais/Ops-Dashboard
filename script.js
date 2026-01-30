// === ЛОГИКА ВКЛАДОК ===
function showTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu li').forEach(l => l.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(element) element.classList.add('active');
}

// === ЛОГИКА МОНИТОРИНГА ===
const syncTable = document.getElementById('sync-table');
const gatewayLabel = document.getElementById('gateway-status');
const statusSite = document.getElementById('status-site');
const statusSms = document.getElementById('status-sms');
const statusPayment = document.getElementById('status-payment');

let transactions = [
    { id: 4001, client: "Client A.", zone: "Fan Zone", bank: "PAID", ticket: "OK" },
    { id: 4002, client: "Client B.", zone: "VIP A", bank: "PAID", ticket: "OK" }
];

function renderTable() {
    syncTable.innerHTML = '';
    transactions.forEach(tx => {
        let action = '<span style="color:#ccc">Нет действий</span>';
        let ticketClass = 'status-paid';
        if (tx.ticket === 'FAIL') {
            ticketClass = 'status-fail';
            action = `<button class="sync-btn" onclick="forceSync(${tx.id})">🔄 Force Sync</button>`;
        }
        syncTable.innerHTML += `<tr><td>#${tx.id}</td><td>${tx.client}</td><td>${tx.zone}</td><td class="status-paid">${tx.bank}</td><td class="${ticketClass}">${tx.ticket}</td><td>${action}</td></tr>`;
    });
}

function simulateCrash() {
    gatewayLabel.innerText = "Gateway: ERROR (502)";
    gatewayLabel.className = "server-status error";
    
    statusSite.className = "status-item error";
    statusSite.innerHTML = "<i class='fas fa-exclamation-triangle'></i> API Gateway: 504 Time-out";
    
    statusPayment.className = "status-item warn";
    statusPayment.innerHTML = "<i class='fas fa-credit-card'></i> Bank Gate: HIGH LATENCY";

    transactions.push({ id: 4003, client: "Client C.", zone: "Fan Zone", bank: "PAID", ticket: "FAIL" });
    transactions.push({ id: 4004, client: "Client D.", zone: "VIP A", bank: "PAID", ticket: "FAIL" });
    renderTable();
    alert("⚠️ SYSTEM ALERT: Шлюз недоступен. Транзакции зависли.");
}

function forceSync(id) {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
        tx.ticket = "OK";
        renderTable();
        if (!transactions.some(t => t.ticket === 'FAIL')) {
            gatewayLabel.innerText = "Gateway: ONLINE";
            gatewayLabel.className = "server-status ok";
            statusSite.className = "status-item ok";
            statusSite.innerHTML = "<i class='fas fa-globe'></i> Core API: ONLINE";
            statusPayment.className = "status-item ok";
            statusPayment.innerHTML = "<i class='fas fa-credit-card'></i> Bank Gate: OK";
            alert("✅ Система восстановлена.");
        }
    }
}

// === ЛОГИКА САППОРТА ===
function toggleMassForm() {
    const isMass = document.getElementById('mass-incident-check').checked;
    const singleFields = document.getElementById('single-fields');
    const massFields = document.getElementById('mass-fields');

    if (isMass) {
        singleFields.style.display = 'none';
        massFields.style.display = 'contents';
    } else {
        singleFields.style.display = 'contents';
        massFields.style.display = 'none';
    }
}

function smartSearch() {
    const query = document.getElementById('search-input').value.trim();
    const resultBox = document.getElementById('search-result');
    resultBox.style.display = 'block';

    if (!query) {
        resultBox.innerHTML = "❌ Введите данные.";
        return;
    }

    if (query.includes('@')) {
        resultBox.innerHTML = `<strong>👤 Найден пользователь:</strong><br>Email: ${query}<br>UID: 889900<br>Статус: Активен`;
    } else if (query.length > 10) {
        resultBox.innerHTML = `<strong>🎫 Найден Билет/Сертификат:</strong><br>Код: ${query}<br>Событие: Grand Concert<br>Статус: <span style="color:red">ИСПОЛЬЗОВАН</span>`;
    } else {
        resultBox.innerHTML = `<strong>📦 Найден Заказ #${query}:</strong><br>Сумма: 15 000<br>Способ: Card *4499<br>Статус: <span style="color:orange">Не доставлен Email</span>`;
    }
}

function generateTicket() {
    const isMass = document.getElementById('mass-incident-check').checked;
    const type = document.getElementById('issue-type').value;
    const error = document.getElementById('esc-error').value;
    let template = "";

    if (isMass) {
        const time = document.getElementById('mass-time').value;
        const scale = document.getElementById('mass-scale').value;
        const examples = document.getElementById('mass-examples').value;

        if (type === 'sms') {
            template = `🚨 MASS INCIDENT: SMS DELIVERY FAIL\n⏰ Start: ${time}\n📉 Scale: ${scale}\n📡 Channel: SMS + EMAIL\n🆔 Examples (UID): ${examples}`;
        } else if (type === 'site') {
            template = `🔥 CRITICAL: SITE DOWN (504/502)\n⏰ Start: ${time}\n📉 Confirmed by: ${scale}\n🌐 Scope: API + Admin Panel\n❗ Error: ${error}`;
        } else if (type === 'payment') {
            template = `💸 MASS INCIDENT: PAYMENT FAILURES\n⏰ Start: ${time}\n💳 Gateway: All Cards\n📉 Scale: ${scale}\n🆔 Examples: ${examples}\n⚠️ Error Text: ${error}`;
        } else if (type === 'superapp') {
            template = `📱 PARTNER APP SYNC ISSUE\n⏰ Start: ${time}\n📉 Symptoms: Price/Time Mismatch\n🆔 Examples: ${examples}\n❗ Confirmed discrepancy.`;
        } else {
            template = `🚨 MASS INCIDENT: ${type.toUpperCase()}\n⏰ Time: ${time}\n📉 Scale: ${scale}\n🆔 Examples: ${examples}`;
        }
    } else {
        const order = document.getElementById('esc-order').value;
        const device = document.getElementById('esc-device').value;
        
        if (type === 'refund') {
            template = `💰 REFUND REQUEST (Delay)\nUID: ${order}\n📱 Channel: Mini-App\nStatus: No confirmation received.`;
        } else {
            template = `🐛 Single Issue: ${type}\nOrder ID: ${order}\nDevice: ${device}\nError: ${error}`;
        }
    }

    document.getElementById('esc-output').value = template;
}

// === АВТОМАТИЗАЦИЯ ===
function generatePromos() {
    const prefix = document.getElementById('promo-prefix').value;
    const count = document.getElementById('promo-count').value;
    let result = "";
    for(let i=0; i < count; i++) result += `${prefix}_${Math.random().toString(36).substring(2,7).toUpperCase()}\n`;
    document.getElementById('promo-output').value = result;
}

function generateVpnScript() {
    const user = document.getElementById('vpn-user').value;
    document.getElementById('vpn-console').innerHTML = `<pre>./easyrsa build-client-full ${user} nopass\n./make_config.sh ${user}</pre>`;
}

// Старт
renderTable();