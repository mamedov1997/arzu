// login.js - CORS PROBLEMİNİN HƏLLİ İLƏ YENİLƏNMİŞ KOD

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('login-button');
    const buttonText = loginButton.querySelector('.button-text');
    const loader = loginButton.querySelector('.loader');

    // MÜTLƏQ YOXLAYIN: BU URL SİZİN TEST EDİB "SALAM..." GÖRDÜYÜNÜZ URL İLƏ EYNİDİR?
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwy8ObW2MwIjidp1r0z8eD_u4LTQbQoiid391R1cnWHO5fRFvaMOWWnrleaMiJ1MbUTpQ/exec';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        buttonText.style.display = 'none';
        loader.style.display = 'inline-block';
        loginButton.disabled = true;
        messageElement.textContent = '';
        messageElement.className = '';

        try {
            // ----- DƏYİŞİKLİK BURADADIR (CORS HƏLLİ) -----
            // 'application/json' YERİNƏ 'text/plain' İSTİFADƏ EDİRİK
            // BU, PREFLIGHT (OPTIONS) SORĞUSUNUN QARŞISINI ALIR
            
            // Məlumatları JSON yox, xüsusi bir ayırıcı ilə (məsələn '|||') göndərək
            const requestBody = username + '|||' + password;

            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    // JSON-u 'text/plain'-ə dəyişirik
                    'Content-Type': 'text/plain;charset=utf-8', 
                },
                body: requestBody, // Birbaşa string göndəririk
            });
            // ----- DƏYİŞİKLİK BİTDİ -----

            if (!response.ok) {
                 throw new Error('Serverlə əlaqə qurula bilmədi: ' + response.statusText);
            }

            // Cavab hələ də JSON olaraq gələcək
            const result = await response.json(); 

            if (result.status === 'success') {
                messageElement.textContent = result.message;
                messageElement.className = 'success';
                loginButton.style.background = '#51ffa8';
                buttonText.textContent = 'Uğurlu!';
                buttonText.style.display = 'inline-block';
                loader.style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1500);

            } else {
                throw new Error(result.message || 'Naməlum xəta');
            }

        } catch (error) {
            messageElement.textContent = error.message;
            messageElement.className = 'error';
            buttonText.style.display = 'inline-block';
            loader.style.display = 'none';
            loginButton.disabled = false;
        }
    });
});
