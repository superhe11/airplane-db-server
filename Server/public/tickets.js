document.addEventListener('DOMContentLoaded', function() {
    const ticketForm = document.getElementById('ticketForm');
    const ticketTypeForm = document.getElementById('ticketTypeForm');
    const ticketTypeSelect = document.getElementById('ticketType');
    const priceInput = document.getElementById('price');
    
    // Обработчик события отправки формы выбора билета
    ticketTypeForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        // Получаем выбранные значения из формы
        const selectedTicketType = ticketTypeSelect.value;
        const price = priceInput.value;
        const flightID = ticketTypeForm.dataset.flightId; // Получаем FlightID из атрибута формы

        // Отправляем данные в корзину
        addToCart(flightID, selectedTicketType, price);
    });

    // Обработчик события отправки формы поиска рейсов
    ticketForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        // Получаем данные из формы
        const departureAirport = document.getElementById('departureAirport').value;
        const arrivalAirport = document.getElementById('arrivalAirport').value;
        const departureDate = document.getElementById('departureDate').value;

        // Отправляем запрос на сервер для получения информации о полётах
        fetchFlights(departureAirport, arrivalAirport, departureDate);
    });
       // Обработчик изменения выбора типа билета
       ticketTypeSelect.addEventListener('change', function() {
        const selectedTicketType = ticketTypeSelect.value;
        // Устанавливаем соответствующую цену в поле ввода
        if (selectedTicketType === 'Economy') {
            priceInput.value = '50.0';
        } else if (selectedTicketType === 'Business') {
            priceInput.value = '75.0';
        } else if (selectedTicketType === 'First') {
            priceInput.value = '125.0';
        }
    });
});

// Функция для отправки запроса на сервер для получения информации о полётах
function fetchFlights(departureAirport, arrivalAirport, departureDate) {
    const formData = {
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        departureDate: departureDate
    };

    fetch('http://localhost:3000/flights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // После получения данных о полётах, вызываем функцию для их отображения на странице
        displayFlights(data);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Что-то пошло не так. Попробуйте еще раз.');
    });
}

// Функция для отображения информации о полётах на странице
function displayFlights(flightsData) {
    console.log('Данные о полётах:', flightsData); // Выводим данные о полётах в консоль для проверки

    const flightsContainer = document.getElementById('flightsContainer');
    flightsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

    // Создаем таблицу
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Аэропорт отлёта</th>
            <th>Аэропорт прилёта</th>
            <th>Время вылета</th>
            <th>Время прилёта</th>
            <th>Купить</th>
        </tr>
    `;
    
    // Заполняем таблицу данными о полётах
    flightsData.forEach(flight => {
        const row = table.insertRow(); // Вставляем новую строку в таблицу
        row.innerHTML = `
            <td>${flight.DepartureAirport}</td>
            <td>${flight.ArrivalAirport}</td>
            <td>${formatTime(flight.DepartureTime)}</td>
            <td>${formatTime(flight.ArrivalTime)}</td>
            <td><button onclick="openTicketModal(${flight.FlightID})">Купить</button></td>
        `;
        row.setAttribute('data-flight-id', flight.FlightID); // Сохраняем FlightID как атрибут строки
    });

    // Добавляем таблицу на страницу
    flightsContainer.appendChild(table);
}


// Функция для форматирования времени в заданный формат
function formatTime(time) {
    // Используем регулярное выражение для форматирования времени в "гггг-мм-дд, чч:мм"
    const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
    const match = time.match(regex);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}, ${match[4]}:${match[5]}`;
    } else {
        return time; // Возвращаем исходное время, если не удалось сопоставить с шаблоном
    }
}

// Функция для отображения всплывающего окна с формой выбора типа билета
// Функция для открытия модального окна с формой выбора типа билета
function openTicketModal(flightID) {
    const modal = document.getElementById('ticketModal');
    modal.style.display = 'block'; // Показываем всплывающее окно

    // Обработчик события клика на кнопку "Закрыть"
    const closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function() {
        modal.style.display = 'none'; // Скрываем всплывающее окно при клике на кнопку "Закрыть"
    };

    // Сохраняем FlightID в атрибут формы
    const ticketTypeForm = document.getElementById('ticketTypeForm');
    ticketTypeForm.dataset.flightId = flightID;
}

// Генерация случайного номера места (ряд 1-30, место A-F)
function generateRandomSeat() {
    const randomRow = Math.floor(Math.random() * 30) + 1; // Генерация случайного ряда (1-30)
    const randomSeatIndex = Math.floor(Math.random() * 6); // Генерация случайного индекса для места (0-5)
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const randomSeat = seatLetters[randomSeatIndex]; // Получение случайной буквы места из массива

    const seatNumber = `${randomSeat}${randomRow}`;
    console.log('Сгенерированный номер места:', seatNumber); // Выводим сгенерированный номер места в консоль
    return seatNumber;
}

// Функция для добавления выбранного билета в корзину
function addToCart(flightID, ticketType, price) {
    let passengerID = document.getElementById('userID').textContent; // Получаем строку с ID пассажира
    passengerID = passengerID.replace(/\D/g, ''); // Удаляем все символы, кроме цифр
    passengerID = parseInt(passengerID); // Преобразуем результат в число

    const seatNumber = generateRandomSeat(); // Генерируем случайный номер места

    // Отправляем запрос на сервер для добавления билета в корзину
    fetch('http://localhost:3000/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            flightID: flightID,
            passengerID: passengerID,
            ticketType: ticketType,
            seatNumber: seatNumber,
            price: price
          
        })
        
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Билет успешно добавлен в корзину!');
        } else {
            alert('Что-то пошло не так. Попробуйте еще раз.');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Что-то пошло не так. Попробуйте еще раз.');
    });
    console.log(flightID, passengerID, ticketType, price, seatNumber);
}
// Обработчик клика на кнопку корзины
const cartBtn = document.getElementById('cartBtn');
cartBtn.addEventListener('click', function() {
    openCartModal();
});

// Функция для открытия модального окна корзины
function openCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'block';
    // Получение ID пользователя
    let passengerID = document.getElementById('userID').textContent; 
    passengerID = passengerID.replace(/\D/g, ''); 
    passengerID = parseInt(passengerID); 
    // Загрузка товаров из корзины
    loadCartItems(passengerID); 

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
}

// Функция для загрузки товаров из корзины
function loadCartItems(passengerID) {
    fetch(`http://localhost:3000/cart?passengerID=${passengerID}`)
    .then(response => response.json())
    .then(cartItems => {
        displayCartItems(cartItems);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров из корзины:', error);
        alert('Ошибка при загрузке товаров из корзины. Попробуйте позже.');
    });
}

function displayCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Аэропорт отлёта</th>
            <th>Аэропорт прилёта</th>
            <th>Время вылета</th>
            <th>Время прилёта</th>
            <th>Класс</th>
            <th>Место</th>
            <th>Цена</th>
            <th>Действия</th>
        </tr>
    `;

    cartItems.forEach(item => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${item.DepartureAirport}</td>
            <td>${item.ArrivalAirport}</td>
            <td>${formatTime(item.DepartureTime)}</td>
            <td>${formatTime(item.ArrivalTime)}</td>
            <td>${item.TicketClass}</td>
            <td>${item.SeatNumber}</td>
            <td>${item.Price}</td>
            <td>
                <button class="deleteBtn" onclick="removeFromCart(${item.ItemID})">Удалить</button>
                <button class="payBtn" onclick="processTicket(${item.ItemID})">Оплатить</button>
            </td>
        `;
    });

    cartItemsContainer.appendChild(table);
}

// Функция для обработки оплаты билета
function processTicket(itemID) {
    fetch(`http://localhost:3000/process-ticket/${itemID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Билет успешно оплачен!');
            loadCartItems(parseInt(document.getElementById('userID').textContent.replace(/\D/g, ''))); // Обновляем корзину
        } else {
            alert('Ошибка при оплате билета: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Что-то пошло не так. Попробуйте еще раз.');
    });
}
// Функция для удаления товара из корзины
function removeFromCart(itemID) {
    fetch(`http://localhost:3000/cart/${itemID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при удалении товара из корзины.');
        }
        return response.json();
    })
    .then(data => {
        // Обновляем отображение товаров в корзине
        loadCartItems(parseInt(document.getElementById('userID').textContent.replace(/\D/g, '')));
        alert('Товар удален из корзины.');
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert(error.message);
    });
}

// Функция для открытия модального окна с билетами пользователя
function openTicketsModal() {
    const modal = document.getElementById('ticketsModal');
    modal.style.display = 'block';

    // Выбираем closeBtn по ID
    const closeBtn = document.getElementById('closeTicketsBtn'); 
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    let passengerID = document.getElementById('userID').textContent;
    passengerID = passengerID.replace(/\D/g, '');
    passengerID = parseInt(passengerID);

    loadUserTickets(passengerID);
}

// Функция для загрузки билетов пользователя
function loadUserTickets(passengerID) {
    fetch(`http://localhost:3000/tickets?passengerID=${passengerID}`)
        .then(response => response.json())
        .then(data => {
            displayUserTickets(data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Что-то пошло не так. Попробуйте еще раз.');
        });
}


// Функция для отображения билетов пользователя
function displayUserTickets(ticketsData) {
    const userTicketsContainer = document.getElementById('userTicketsContainer');
    userTicketsContainer.innerHTML = ''; // Очищаем контейнер

    if (ticketsData.length === 0) {
        userTicketsContainer.innerHTML = 'Вы ещё не оплатили ни одного билета';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Аэропорт отлёта</th>
            <th>Аэропорт прилёта</th>
            <th>Время вылета</th>
            <th>Время прилёта</th>
            <th>Класс</th>
            <th>Место</th>
            <th>Цена</th>
            <th>Действия</th>
        </tr>
    `;

    ticketsData.forEach(ticket => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${ticket.DepartureAirport}</td>
            <td>${ticket.ArrivalAirport}</td>
            <td>${formatTime(ticket.DepartureTime)}</td>
            <td>${formatTime(ticket.ArrivalTime)}</td>
            <td>${ticket.TicketClass}</td>
            <td>${ticket.SeatNumber}</td>
            <td>${ticket.Price}</td>
            <td><button onclick="cancelTicket(${ticket.TicketID})">Отказаться</button></td>
        `;
    });

    userTicketsContainer.appendChild(table);
}

// Функция для отказа от билета
function cancelTicket(ticketID) {
    if (confirm('Вы уверены, что хотите отказаться от билета? Средства возвращены не будут.')) {
        fetch(`http://localhost:3000/tickets/${ticketID}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Вы успешно отказались от билета.');
                // loadUserTickets(passengerID); // Обновляем список билетов
            } else {
                alert('Что-то пошло не так. Попробуйте еще раз.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Что-то пошло не так. Попробуйте еще раз.');
        });
    }
}

// Добавляем обработчик события для новой кнопки
const ticketsBtn = document.getElementById('ticketsBtn');
ticketsBtn.addEventListener('click', openTicketsModal);