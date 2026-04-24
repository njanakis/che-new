/**
 * Розумний помічник "Бандура" для ОЦНТ
 */

// 1. Налаштування синтезу мовлення
function speakResponse(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'uk-UA';
        utterance.pitch = 1.3; // Мультяшний тон
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// 2. Функція зміни станів Бандури та хмаринки тексту
function changeBanduraState(state) {
    const bandura = document.getElementById('bandura-ai');
    const bubbleText = document.getElementById('ai-text-bubble'); // Текст у хмаринці
    
    // Якщо картинки лежать у корені репозиторію, шлях порожній, якщо в папці — додай 'img/'
    const path = ''; 

    switch(state) {
        case 'listening':
            if(bandura) bandura.src = `${path}bandura-listening.png`;
            if(bubbleText) bubbleText.innerText = "Слухаю вас уважно...";
            break;
        case 'thinking':
            if(bandura) bandura.src = `${path}bandura-thinking.png`;
            if(bubbleText) bubbleText.innerText = "Зараз подивлюся в архівах...";
            break;
        case 'pointing':
            if(bandura) bandura.src = `${path}bandura-pointing.png`;
            if(bubbleText) bubbleText.innerText = "Ось, що мені вдалося знайти!";
            break;
        case 'error':
            if(bandura) bandura.src = `${path}bandura-idle.png`;
            if(bubbleText) bubbleText.innerText = "Ой, струна обірвалася (помилка)...";
            break;
        default:
            if(bandura) bandura.src = `${path}bandura-idle.png`;
            if(bubbleText) bubbleText.innerText = "Запитай, я допоможу знайти колектив!";
    }
}

// 3. Основна функція пошуку
async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    const responseDisplay = document.getElementById('ai-response-text'); // Поле для тексту відповіді

    if (!query) return;

    // Стан "Думаю"
    changeBanduraState('thinking');
    if(responseDisplay) responseDisplay.innerText = "Шукаю...";

    try {
        const response = await fetch('https://n8n.narodocnt.online/webhook/search-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) throw new Error('Gateway Timeout');

        const data = await response.json();
        const result = data.output || "На жаль, я нічого не знайшла за цим запитом.";

        // Виводимо результат
        if(responseDisplay) responseDisplay.innerText = result;
        
        // Бандура вказує на результат і говорить
        changeBanduraState('pointing');
        speakResponse(result);

        // Через 10 секунд повертаємо до спокою
        setTimeout(() => changeBanduraState('idle'), 10000);

    } catch (error) {
        console.error("Помилка:", error);
        changeBanduraState('error');
        if(responseDisplay) responseDisplay.innerText = "Не вдалося зв'язатися з сервером. Спробуйте пізніше.";
        speakResponse("Вибачте, сталася помилка зв'язку.");
    }
}

// 4. Ініціалізація подій
document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('mic-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Клік на кнопку пошуку
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Enter у полі введення
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // ГОЛОСОВИЙ ПОШУК
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && micBtn) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'uk-UA';

        micBtn.onclick = () => {
            try {
                recognition.start();
                changeBanduraState('listening');
                micBtn.style.color = 'red';
            } catch (e) {
                console.log("Recognition already started");
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if(searchInput) searchInput.value = transcript;
            performSearch();
        };

        recognition.onend = () => {
            micBtn.style.color = '';
        };
        
        recognition.onerror = () => {
            changeBanduraState('idle');
            micBtn.style.color = '';
        };
    }
});
