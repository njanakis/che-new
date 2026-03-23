// Використовуємо self-invoking функцію
(function() {
    function injectAboutModule() {
        // Перевіряємо, чи ми вже не додали вікно (щоб не дублювати)
        if (document.getElementById('aboutModal')) return;

        // 1. Додаємо стилі
        const style = document.createElement('style');
        style.innerHTML = `
            .logo-animated {
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                cursor: pointer !important;
            }
            .logo-animated:hover {
                transform: translateY(-10px) scale(1.02) !important;
                filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) !important;
            }
            .modal-overlay {
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
                z-index: 99999; justify-content: center; align-items: center;
            }
            .modal-content {
                background: #fff; padding: 40px; border-radius: 25px;
                max-width: 550px; width: 90%; position: relative;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                border: 4px solid #f39c12; animation: slideInAbout 0.5s ease;
                font-family: 'Segoe UI', Roboto, sans-serif; color: #333;
            }
            @keyframes slideInAbout {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .close-modal {
                position: absolute; top: 15px; right: 20px;
                font-size: 35px; cursor: pointer; color: #bbb; line-height: 1;
            }
            .close-modal:hover { color: #e74c3c; }
            .modal-header { font-size: 26px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #f8f9fa; padding-bottom: 10px; color: #2c3e50; }
            .genre-list { margin: 20px 0; padding-left: 20px; list-style: none; }
            .genre-list li { margin-bottom: 10px; font-size: 17px; position: relative; }
            .genre-list li::before { content: '✨'; position: absolute; left: -25px; }
        `;
        document.head.appendChild(style);

        // 2. Додаємо HTML
        const modalHTML = `
            <div id="aboutModal" class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal" onclick="closeAbout()">&times;</span>
                    <div class="modal-header">Про нас</div>
                    <div class="modal-body">
                        <p><b>Відділ народної творчості</b> — методичний та творчий центр Черкаського ОЦНТ.</p>
                        <p>Ми опікуємося культурою Черкащини у таких жанрах:</p>
                        <ul class="genre-list">
                            <li><b>Хореографічний</b></li>
                            <li><b>Вокально-хоровий</b></li>
                            <li><b>Музично-інструментальний</b></li>
                            <li><b>Театральний</b></li>
                        </ul>
                        <p style="text-align: center; font-style: italic; margin-top: 20px;">Зберігаємо традиції — творимо майбутнє!</p>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Глобальні функції (мають бути доступні для onclick)
    window.openAbout = function() {
        const modal = document.getElementById('aboutModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            // Якщо раптом HTML ще не вставився
            injectAboutModule();
            document.getElementById('aboutModal').style.display = 'flex';
        }
    };

    window.closeAbout = function() {
        const modal = document.getElementById('aboutModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Закриття кліком по фону
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('aboutModal');
        if (e.target === modal) closeAbout();
    });

    // Ініціалізація при завантаженні
    if (document.readyState === 'complete') {
        injectAboutModule();
    } else {
        window.addEventListener('load', injectAboutModule);
    }
})();
