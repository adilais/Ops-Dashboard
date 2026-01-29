// === ЛОГИКА ВКЛАДОК ===
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu li').forEach(l => l.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// === ЛОГИКА МОНИТОРИНГА ===
const syncTable = document.getElementById('sync-table');
const gatewayLabel = document.getElementById('gateway-status');

// Исходные данные (нормальные)
let transactions = [
    { id: 4001, client: "Айдос К.", zone: "Фан-зона", bank: "PAID", ticket: "OK" },
    { id: 4002, client: "Елена С.", zone: "Сектор А", bank: "PAID", ticket: "OK" }
];

function renderTable() {
    syncTable.innerHTML = '';
    transactions.forEach(tx => {
        let action = '<span style="color:#ccc">Нет действий</span>';
        let ticketClass = 'status-paid';
        
        if (tx.ticket === 'FAIL') {
            ticketClass = 'status-fail';
            action = `<button class="sync-btn" onclick="forceSync(${tx.id})">🔄 Force Sync</button>`;
        } else if (tx.ticket === 'OK') {
            ticketClass = 'status-paid';
        }

        syncTable.innerHTML += `
            <tr>
                <td>#${tx.id}</td>
                <td>${tx.client}</td>
                <td>${tx.zone}</td>
                <td class="status-paid">${tx.bank}</td>
                <td class="${ticketClass}">${tx.ticket}</td>
                <td>${action}</td>
            </tr>
        `;
    });
}

// Кнопка "Уронить шлюз"
function simulateCrash() {
    gatewayLabel.innerText = "Gateway: ERROR (502)";
    gatewayLabel.classList.remove('ok');
    gatewayLabel.classList.add('error');

    // Проблемные транзакции
    transactions.push({ id: 4003, client: "Султан Б.", zone: "Фан-зона", bank: "PAID", ticket: "FAIL" });
    transactions.push({ id: 4004, client: "Мария В.", zone: "Сектор А", bank: "PAID", ticket: "FAIL" });
    
    renderTable();
    alert("⚠️ ВНИМАНИЕ: Зафиксирован сбой шлюза! Транзакции зависли.");
}

// Кнопка "Force Sync"
function forceSync(id) {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
        tx.ticket = "OK";
        renderTable();
        // Проверяем, если все починили - возвращаем статус ОК
        if (!transactions.some(t => t.ticket === 'FAIL')) {
            gatewayLabel.innerText = "Gateway: ONLINE";
            gatewayLabel.classList.remove('error');
            gatewayLabel.classList.add('ok');
            alert("✅ Синхронизация успешна. Билет отправлен.");
        }
    }
}

// === ЛОГИКА АВТОМАТИЗАЦИИ ===
function generatePromos() {
    const prefix = document.getElementById('promo-prefix').value;
    const count = document.getElementById('promo-count').value;
    let result = "";

    for(let i=0; i < count; i++) {
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        result += `${prefix}_${randomStr}\n`;
    }

    document.getElementById('promo-output').value = result;
}

// === ЛОГИКА VPN  ===
function generateVpnScript() {
    const user = document.getElementById('vpn-user').value;
    if(!user) return alert("Введите имя!");

    const script = `
# Автоматическое создание пользователя VPN
# Дата: ${new Date().toLocaleDateString()}

useradd -m -s /bin/false ${user}
echo "Создан системный пользователь ${user}"

cd /etc/openvpn/easy-rsa
./easyrsa build-client-full ${user} nopass
echo "Сгенерированы сертификаты для ${user}"

# Генерация конфига
./make_config.sh ${user}
echo "Конфиг ${user}.ovpn готов к отправке!"
    `;

    const consoleDiv = document.getElementById('vpn-console');
    consoleDiv.innerHTML = `<pre>${script}</pre>`;
}

renderTable();
