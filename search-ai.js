/**
 * Розумний пошук для сайту народної творчості ОЦНТ
 */

// Оголошуємо функцію ПОЗА межами DOMContentLoaded, щоб вона була доступна всюди
async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    if (!query) return;

    // Створюємо просте вікно для відповіді, якщо його ще немає
    let aiModal = document.getElementById('ai-response-modal');
    if (!aiModal) {
        aiModal = document.createElement('div');
        aiModal.id = 'ai-response-modal';
        aiModal.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border-radius:15px; box-shadow:0 0 20px rgba(0,0,0,0.5); z-index:10000; max-width:90%; width:400px;">
                <h3 style="margin-top:0; color:#d32f2f;">🤖 Відповідь ШІ</h3>
                <div id="ai-text" style="font-size:16px; line-height:1.5; max-height:300px; overflow-y:auto;">Завантаження...</div>
                <button onclick="document.getElementById('ai-response-modal').style.display='none'" style="margin-top:15px; padding:8px 15px; background:#d32f2f; color:white; border:none; border-radius:5px; cursor:pointer;">Закрити</button>
            </div>
        `;
        document.body.appendChild(aiModal);
    }
    
    document.getElementById('ai-text').innerText = "Шукаю інформацію...";
    aiModal.style.display = 'block';

    try {
        const response = await fetch('https://n8n.narodocnt.online/webhook/search-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();
        
        // Виводимо результат у наше вікно
        document.getElementById('ai-text').innerText = data.output || "На жаль, нічого не знайдено.";

    } catch (error) {
        console.error("Помилка ШІ:", error);
        document.getElementById('ai-text').innerHTML = `
            <p style="color:red;">Помилка зв'язку з ШІ.</p>
            <p>Але ви можете знайти це в Google:</p>
            <a href="https://www.google.com/search?q=site:narodocnt.online ${encodeURIComponent(query)}" target="_blank" style="color:blue;">Шукати в Google</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('mic-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Прив'язуємо клік на лінзу
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Прив'язуємо натискання Enter в полі введення
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // НАЛАШТУВАННЯ ГОЛОСОВОГО ПОШУКУ
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && micBtn) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'uk-UA';

        micBtn.onclick = () => {
            recognition.start();
            micBtn.style.color = 'red';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            performSearch(); // Запускаємо пошук автоматично після голосу
        };

        recognition.onend = () => {
            micBtn.style.color = '';
        };
    }
});
