// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('login-button');
    const buttonText = loginButton.querySelector('.button-text');
    const loader = loginButton.querySelector('.loader');

    // ADDIM 1-DƏ ALDIĞINIZ GOOGLE APPS SCRIPT URL-ni BURA YAPIŞDIRIN
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwy8ObW2MwIjidp1r0z8eD_u4LTQbQoiid391R1cnWHO5fRFvaMOWWnrleaMiJ1MbUTpQ/exec';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Düyməni gözləmə rejiminə keçir
        buttonText.style.display = 'none';
        loader.style.display = 'inline-block';
        loginButton.disabled = true;
        messageElement.textContent = '';
        messageElement.className = '';

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });

            // Yoxlayın ki, cavab həqiqətən gəlibmi
            if (!response.ok) {
                 throw new Error('Serverlə əlaqə qurula bilmədi: ' + response.statusText);
            }

            const result = await response.json();

            if (result.status === 'success') {
                // UĞURLU GİRİŞ
                messageElement.textContent = result.message;
                messageElement.className = 'success';
                
                loginButton.style.background = '#51ffa8';
                buttonText.textContent = 'Uğurlu!';
                buttonText.style.display = 'inline-block';
                loader.style.display = 'none';
                
                // 1.5 saniyə sonra ƏSAS EKRANA YÖNLƏNDİR
                setTimeout(() => {
                    window.location.href = 'main.html'; // YENİ SƏHİFƏ
                }, 1500);

            } else {
                // Səhv parol və ya istifadəçi
                throw new Error(result.message || 'Naməlum xəta');
            }

        } catch (error) {
            // "Failed to fetch" və ya digər xətalar
            messageElement.textContent = error.message;
            messageElement.className = 'error';
            
            // Düyməni ilkin vəziyyətinə qaytar
            buttonText.style.display = 'inline-block';
            loader.style.display = 'none';
            loginButton.disabled = false;
        }
    });
});
