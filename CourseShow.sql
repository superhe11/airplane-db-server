-- •	Реализация прав для администратора БД и клиента.
EXECUTE AS USER = 'Customers';
EXECUTE AS USER = 'Owner';
SELECT CURRENT_USER;
REVERT;


--Customer
EXEC AddToShoppingCart @FlightID = 1, @PassengerID = 1, @SeatNumber = 'A23', @TicketClass = 'First', @Price = '200.0';
EXEC DeleteTicket @TicketID = 3005
EXEC GetAllTickets;
EXEC GetAllCartData;
EXEC ProcessTicket @TicketID = 1;
EXEC GetAllTickets; --ошибка
Select * from Airplanes --ошибка
EXEC GetAllPassengers;

--•	Реализовать систему хранения объектов: рейсы, пути, самолёты.
EXEC ShowTableStructure;
EXEC GetAllTickets
Exec GetAllFlights



--•	Реализовать функционал администратора: добавление, редактирование, удаление данных, оформление, возврат билетов.
EXEC TotalPurge;
EXEC GetAllPassengers;
-- Добавление нового самолета
EXEC AddAirplane @Model = 'Airbus A321', @Capacity = 2, @ProductionYear = '2018-01-01';
--Изменение самолёта по его ID
EXEC UpdateAirplane @AirplaneID = 2, @Model = 'Airbus A121', @Capacity = 230, @ProductionYear = '2018-01-01';
-- Удаление самолета с ID = 1
EXEC DeleteAirplane @AirplaneID = 2;
-- Получение списка всех самолетов
EXEC GetAllAirplanes;


--Оформляем рейс
EXEC AddFlight 'RTG', 'JFK', '2024-10-15T10:00:00', '2024-10-15T14:30:00', 3;
EXEC GetAllFlights;

--Добавляем сотрудников и создаём экипаж
DECLARE @i INT = 1;
WHILE @i <= 6
BEGIN
    EXEC AddRandomEmployee;
    SET @i = @i + 1;
END;
EXEC GetAllEmployees;

-- Добавление случайного экипажа к рейсу с ID 1
EXEC AddRandomCrew @FlightID = 2;
EXEC GetAllCrew @FlightID = 1;

--Регестрируем пользователя
EXEC AddPassenger @FirstName = 'John', @LastName = 'Doe', @PassportNumber = '1234567890', @BirthDate = '1980-03-10';

EXEC GetAllPassengers;

--Пользователь добавляет билет в корзину
EXEC AddToShoppingCart @FlightID = 1, @PassengerID = 1, @SeatNumber = 'A23', @TicketClass = 'First', @Price = '200.0';
EXEC GetAllCartData;


--Оформляем билет
EXEC ProcessTicket @TicketID = 1;
EXEC GetAllTickets;
EXEC GetAllCartData;


--•	Добавить систему сортировки данных в БД.
EXEC SortTable @TableName = 'Employees', @ColumnName = 'LastName', @SortOrder = 'DESC';

--• Добавить систему поиска данных в БД.
 EXEC GetAirplanesByModel @Model = 'Boeing 777';

 -- Получение информации о рейсе по ID
EXEC GetFlightByID 1;

-- Получение списка всех рейсов
EXEC GetAllFlights;

-- Получение информации о пассажире по ID
EXEC GetPassengerByID @PassengerID = 1;

-- Получение списка всех пассажиров
EXEC GetAllPassengers;

-- Получение информации о пассажире по номеру паспорта
EXEC GetPassengerByPassport @PassportNumber = '12345678';


--•	Добавить возможность покупки и возврата билетов пользователем.
-- Приложение

--• Реализовать возможность создания отчётов (отчёт о кол-ве проданных билетов за промежуток времени).

EXEC GetTicketSalesReport @StartDate = '2023-01-01', @EndDate = '2025-01-01'; 


--•	Реализовать систему аналитики данных (кол-во рейсов, средний пройденный путь, средняя цена билетов).

EXEC GetFlightCount;

EXEC GetAverageTicketPrice;
--================================(Индекс)================================
-- Вызов хранимой процедуры
EXEC dbo.FillAirports;
SELECT * FROM AIRPORTS;

EXEC SELECTAIRPORTS;

-- Создание кластерного индекса на столбце Code
CREATE CLUSTERED INDEX IX_Airports_Code ON dbo.Airports (Code);
SELECT * FROM dbo.Airports WHERE Code = 'JFK';

--===============================(Функции)===================================
use aviasales;
-- Пример использования функции для получения возраста самолета в годах
SELECT dbo.GetAirplaneAge(1);

-- Пример использования функции для проверки доступности самолета
DECLARE @StartDate DATETIME = '2024-09-15';
DECLARE @EndDate DATETIME = '2024-03-08';
SELECT dbo.IsAirplaneAvailable(1, @StartDate, @EndDate);

DECLARE @StartDate DATETIME = '2024-15-09';
DECLARE @EndDate DATETIME = '2024-15-11';
SELECT dbo.IsAirplaneAvailable(1, @StartDate, @EndDate);

Select * from Flights

-- Пример использования функции для получения продолжительности рейса в часах
SELECT dbo.GetFlightDuration(1);

-- Пример использования функции для получения полного имени пассажира
SELECT dbo.GetPassengerFullName(1);

-- Пример использования функции для получения общей выручки от продажи билетов на определенный рейс
SELECT dbo.GetRevenueByFlight(1);

-- Пример использования функции для получения аэропорта назначения, в который было продано больше всего билетов
SELECT dbo.GetMostPopularDestination();

-- Пример использования функции для получения стажа работы сотрудника в годах
SELECT dbo.GetEmployeeExperience(1);

-- Пример использования функции для получения количества сотрудников определенной должности
SELECT dbo.GetTotalEmployeesByPosition('Pilot');

-- Пример использования функции для проверки, укомплектован ли экипаж
SELECT dbo.IsCrewComplete(1);

--================(Триггеры)===================

--CREATE
EXEC AddTicket @FlightID = 1, @PassengerID = 5, @SeatNumber = '12A', @TicketClass = 'Economy', @Price = 250.00;

--UPDATE
EXEC UpdateTicket @TicketID = 1, @FlightID = 1, @PassengerID = 5, @SeatNumber = '12A', @TicketClass = 'Business', @Price = 500.00; 

--DELETE
EXEC DeleteTicket @TicketID = 1;

--Overextend
DECLARE @i INT = 1;
WHILE @i <= 220
BEGIN
    EXEC AddRandomTicket;
    SET @i = @i + 1;
END;
select * from Tickets
select * from Flights
Delete from Tickets;
EXEC AddAirplane @Model = 'Airbus A321', @Capacity = 2, @ProductionYear = '2018-01-01';
select * from Airplanes;