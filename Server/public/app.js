const { createApp } = Vue;

createApp({
    
    data() {
        return {
            showRegistrationForm: false,
            firstName: '',
            lastName: '',
            passportNumber: '',
            birthDate: ''
        }
    },
    methods: {
        async registerPassenger() {
            // ... (сбор данных из формы в passengerData)

            try {
                // Отправка POST-запроса на сервер
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(passengerData)
                });

                // Проверка успешной отправки
                if (response.ok) {
                    console.log('Data sent to server successfully!'); 
                    // TODO: Очистка формы или переход на другую страницу
                } else {
                    console.error('Error sending data:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}).mount('#app');