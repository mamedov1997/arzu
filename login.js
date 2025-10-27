// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('login-button');
    const buttonText = loginButton.querySelector('.button-text');
    const loader = loginButton.querySelector('.loader');

    // ADDIM 2-DƏ ƏLDƏ ETDİYİNİZ URL-İ BURA YAPIŞDIRIN
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwy8ObW2MwIjidp1r0z8eD_u4LTQbQoiid391R1cnWHO5fRFvaMOWWnrleaMiJ1MbUTpQ/exec';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Səhifənin yenilənməsinin qarşısını al

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

            const result = await response.json();

            if (result.status === 'success') {
                // Giriş uğurludur
                messageElement.textContent = result.message;
                messageElement.className = 'success';
                
                // Uğurlu giriş animasiyası
                loginButton.style.background = '#51ffa8';
                buttonText.textContent = 'Uğurlu!';
                
                // 1.5 saniyə sonra əsas səhifəyə yönləndir
                setTimeout(() => {
                    // Sizin növbəti səhifəniz (məsələn, məhsul satış səhifəsi)
                    window.location.href = 'ana_sehife.html'; // NÖVBƏTİ SƏHİFƏNİN ADI
                }, 1500);

            } else {
                // Giriş uğursuzdur
                throw new Error(result.message || 'Naməlum xəta');
            }

        } catch (error) {
            messageElement.textContent = error.message;
            messageElement.className = 'error';
            
            // Düyməni ilkin vəziyyətinə qaytar
            buttonText.style.display = 'inline-block';
            loader.style.display = 'none';
            loginButton.disabled = false;
        }
    });
});
