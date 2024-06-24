const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware для обработки JSON и urlencoded данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройки подключения к базе данных

const config = {
    server: 'localhost',
    database: 'aviasales',
    user: 'sa',
    password: '12345',
    port: 1433,
    options: {
        encrypt: false
    }
};

// Обработчик для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Обработчик для статических файлов (CSS и JavaScript)
app.use(express.static(path.join(__dirname, 'public')));
// Метод для обработки запроса на регистрацию

app.post('/register', async (req, res) => {
    const { firstName, lastName, passportNumber, birthDate } = req.body;
    console.log('Получены данные регистрации:', req.body); // Выводим полученные данные в консоль
    try {
        // Подключаемся к базе данных
        await sql.connect(config);
        
        // Выполняем запрос к базе данных
        const result = await sql.query`INSERT INTO Passengers (FirstName, LastName, PassportNumber, BirthDate) VALUES (${firstName}, ${lastName}, ${passportNumber}, ${birthDate})`;
        
        // Отправляем ответ клиенту
        res.json({ success: true });
    } catch (error) {
        // Если произошла ошибка, отправляем соответствующий ответ
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        // Закрываем соединение с базой данных
        await sql.close();
    }
});

app.post('/login', async (req, res) => {
    const { loginFirstName, loginPassportNumber } = req.body;
    try {
        // Подключаемся к базе данных
        await sql.connect(config);
        
        // Выполняем запрос к базе данных для проверки наличия пользователя
        const result = await sql.query`SELECT PassengerID, FirstName FROM Passengers WHERE FirstName = ${loginFirstName} AND PassportNumber = ${loginPassportNumber}`;
        
        if (result.recordset.length > 0) {
            // Пользователь найден, возвращаем успешный ответ с PassengerID и именем пользователя
            const passengerID = result.recordset[0].PassengerID;
            const firstName = result.recordset[0].FirstName;
            res.json({ success: true, passengerID: passengerID, username: firstName });
        } else {
            // Пользователь не найден, возвращаем ошибку
            res.json({ success: false, error: 'Пользователь не найден.' });
        }
    } catch (error) {
        // Если произошла ошибка, отправляем соответствующий ответ
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        // Закрываем соединение с базой данных
        await sql.close();
    }
});


// Добавляем новый обработчик для запроса полётов
app.post('/flights', async (req, res) => {
    const { departureAirport, arrivalAirport, departureDate } = req.body;
    try {
        // Подключаемся к базе данных
        await sql.connect(config);
        
        // Выполняем запрос к базе данных для получения информации о доступных полётах
        const result = await sql.query`
            SELECT FlightID, DepartureAirport, ArrivalAirport, DepartureTime, ArrivalTime
            FROM Flights
            WHERE DepartureAirport = ${departureAirport}
            AND ArrivalAirport = ${arrivalAirport}
            AND CONVERT(DATE, DepartureTime) >= ${departureDate}
        `;
        
        // Отправляем ответ клиенту с информацией о полётах
        res.json(result.recordset);
    } catch (error) {
        // Если произошла ошибка, отправляем соответствующий ответ
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        // Закрываем соединение с базой данных
        await sql.close();
    }
});

// Добавляем новый обработчик для запроса добавления билета в корзину
app.post('/add-to-cart', async (req, res) => {
    const { flightID, passengerID, ticketType, seatNumber, price } = req.body;
    try {
        // Подключаемся к базе данных
        await sql.connect(config);
        
        // Выполняем запрос к базе данных для добавления билета в корзину
        const result = await sql.query`
            INSERT INTO ShoppingCart (FlightID, PassengerID, SeatNumber, TicketClass, Price)
            VALUES (${flightID}, ${passengerID},${seatNumber}, ${ticketType}, ${price})
        `;
        
        // Отправляем ответ клиенту
        res.json({ success: true });
    } catch (error) {
        // Если произошла ошибка, отправляем соответствующий ответ
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        // Закрываем соединение с базой данных
        await sql.close();
    }
});

app.get('/cart', async (req, res) => {
    const passengerID = req.query.passengerID;
    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                sc.ItemID, 
                f.DepartureAirport, 
                f.ArrivalAirport, 
                f.DepartureTime, 
                f.ArrivalTime, 
                sc.TicketClass, 
                sc.SeatNumber, 
                sc.Price
            FROM ShoppingCart sc
            JOIN Flights f ON sc.FlightID = f.FlightID
            WHERE sc.PassengerID = ${passengerID}
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error('Ошибка при получении товаров из корзины:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await sql.close();
    }
});


// Обработчик для удаления товара из корзины
app.delete('/cart/:itemID', async (req, res) => {
    const itemID = req.params.itemID;
    try {
        await sql.connect(config);
        const result = await sql.query`
            DELETE FROM ShoppingCart
            WHERE ItemID = ${itemID}
        `;
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении товара из корзины:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        await sql.close();
    }
});

// Обработчик для запуска процедуры ProcessTicket
app.post('/process-ticket/:itemID', async (req, res) => {
    const itemID = req.params.itemID;
    try {
        await sql.connect(config);
        const result = await sql.query`
            EXEC ProcessTicket @TicketID = ${itemID}
        `;
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при обработке оплаты:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        await sql.close();
    }
});

app.get('/tickets', async (req, res) => {
    const passengerID = req.query.passengerID;
    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                TicketID,
                f.DepartureAirport, 
                f.ArrivalAirport, 
                f.DepartureTime, 
                f.ArrivalTime, 
                t.TicketClass, 
                t.SeatNumber, 
                t.Price
            FROM Tickets t
            JOIN Flights f ON t.FlightID = f.FlightID
            WHERE t.PassengerID = ${passengerID}
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error('Ошибка при получении билетов пользователя:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await sql.close();
    }
});

// Обработчик для отказа от билета
app.delete('/tickets/:ticketID', async (req, res) => {
    const ticketID = req.params.ticketID;
    try {
        await sql.connect(config);
        const result = await sql.query`
            DELETE FROM Tickets
            WHERE TicketID = ${ticketID}
        `;
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при отказе от билета:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        await sql.close();
    }
});


// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
