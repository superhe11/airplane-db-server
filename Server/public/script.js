document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const backBtn = document.getElementById('backBtn');
    const backLoginBtn = document.getElementById('backLoginBtn');

    // Показываем форму регистрации при клике на кнопку "Регистрация"
    registerBtn.addEventListener('click', function() {
        registrationFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    });

    // Показываем форму входа при клике на кнопку "Вход"
    loginBtn.addEventListener('click', function() {
        loginFormContainer.style.display = 'block';
        registrationFormContainer.style.display = 'none';
    });

    // Возвращаемся к начальной странице при клике на кнопку "Назад" в форме регистрации
    backBtn.addEventListener('click', function() {
        registrationFormContainer.style.display = 'none';
    });

    // Возвращаемся к начальной странице при клике на кнопку "Назад" в форме входа
    backLoginBtn.addEventListener('click', function() {
        loginFormContainer.style.display = 'none';
    });

    // Функционал регистрации
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const json = JSON.stringify(Object.fromEntries(formData));

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Регистрация прошла успешно!');
                this.reset();
                registrationFormContainer.style.display = 'none'; 
            } else {
                alert('Ошибка при регистрации: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Что-то пошло не так. Попробуйте еще раз.');
        });
    });

  // Функционал входа
// Функционал входа
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const json = JSON.stringify(Object.fromEntries(formData));
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        alert('Вход выполнен успешно! PassengerID: ' + data.passengerID);
        this.reset();
  
        // Сохраняем ID и имя пользователя в localStorage
        localStorage.setItem('userID', data.passengerID);
        localStorage.setItem('username', data.username); // Добавляем эту строку
  
        // Перенаправляем пользователя на страницу Tickets.html
        window.location.href = 'tickets.html';
      } else {
        alert('Ошибка при входе: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Что-то пошло не так. Попробуйте еще раз.');
    });
  });
});