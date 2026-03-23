(function() {
    // 1. Створюємо та додаємо CSS стилі в <head>
    const style = document.createElement('style');
    style.innerHTML = `
        .logo-animated {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            display: inline-block;
        }
        .logo-animated:hover {
            transform: translateY(-10px) scale(1.05);
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
        }
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background: #fff;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 3px solid #f39c12;
            animation: slideInAbout 0.4s ease;
            font-family: sans-serif;
        }
        @keyframes slideInAbout {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .close-modal {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 28px;
            cursor: pointer;
            color: #999;
            line-height: 1;
        }
        .close-modal:hover { color: #e74c3c; }
        .modal-header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .modal-body {
            font-size: 16px;
            line-height: 1.6;
            color: #444;
        }
    `;
    document.head.appendChild(style);

    // 2. Створюємо HTML структуру вікна
   // 2. Створюємо HTML структуру вікна з оновленим текстом
    const modalHTML = `
        <div id="aboutModal" class="modal-overlay">
            <div class="modal-content">
                <span class="close-modal" id="closeAboutBtn">&times;</span>
                <div class="modal-header">Про нас</div>
                <div class="modal-body">
                    <p><b>Відділ народної творчості</b> — ключовий підрозділ Черкаського обласного центру народної творчості та культурно-освітньої роботи.</p>
                    <p>Ми є головним методичним та творчим хабом, що опікується багатогранною культурою Черкащини у таких напрямках:</p>
                    <ul class="genre-list">
                        <li><b>Хореографічний жанр:</b> від автентичного танцю до сучасних постановок.</li>
                        <li><b>Вокально-хоровий жанр:</b> плекаємо силу народного голосу та багатоголосся нашого краю.</li>
                        <li><b>Музично-інструментальний жанр:</b> розвиваємо майстерність виконання на традиційних та сучасних інструментах.</li>
                        <li><b>Театральний жанр:</b> підтримуємо аматорські колективи у створенні живого сценічного дійства.</li>
                    </ul>
                    <p>Наша місія — зберігати національний код і водночас створювати сучасний простір, де народна творчість звучить актуально та драйвово!</p>
                </div>
            </div>
        </div>
    `;
    
    // Додаємо HTML в кінець body після завантаження сторінки
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Логіка функцій
    const modal = document.getElementById('aboutModal');
    const closeBtn = document.getElementById('closeAboutBtn');

    // Глобальна функція для відкриття (щоб працював onclick у HTML)
    window.openAbout = function() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeAbout = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeBtn.onclick = window.closeAbout;

    window.onclick = function(event) {
        if (event.target == modal) { window.closeAbout(); }
    };
})();
