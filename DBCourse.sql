-- Airplanes (1)
DECLARE @airplaneCount INT = 1;
WHILE @airplaneCount <= 1
BEGIN
    EXEC AddRandomAirplane;
    SET @airplaneCount = @airplaneCount + 1;
END;

-- Flights (30)
DECLARE @flightCount INT = 1;
WHILE @flightCount <= 30
BEGIN
    EXEC AddRandomFlight;
    SET @flightCount = @flightCount + 1;
END;

-- Passengers (1000)
DECLARE @passengerCount INT = 1;
WHILE @passengerCount <= 1000
BEGIN
    EXEC AddRandomPassenger;
    SET @passengerCount = @passengerCount + 1;
END;

-- Tickets (3000)
DECLARE @ticketCount INT = 1;
WHILE @ticketCount <= 3000
BEGIN
    EXEC AddRandomTicket;
    SET @ticketCount = @ticketCount + 1;
END;

-- Employees (100)
DECLARE @employeeCount INT = 1;
WHILE @employeeCount <= 100
BEGIN
    EXEC AddRandomEmployee;
    SET @employeeCount = @employeeCount + 1;
END;

-- Crews (7)
DECLARE @crewCount INT = 1;
WHILE @crewCount <= 7
BEGIN
    DECLARE @randomFlightID INT;
    SELECT TOP 1 @randomFlightID = FlightID FROM Flights ORDER BY NEWID();
    EXEC AddRandomCrew @FlightID = @randomFlightID;
    SET @crewCount = @crewCount + 1;
END;



exec GetAllAirplanes
exec GetAllCrew @FlightID = 1;
exec GetAllEmployees
exec GetAllFlights
exec GetAllPassengers
exec GetAllTickets
exec GetAllCartData



CREATE DATABASE aviasales;
-- Создание таблицы "Самолеты"
CREATE TABLE Airplanes (
    AirplaneID INT PRIMARY KEY IDENTITY,
    Model NVARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    ProductionYear DATE NOT NULL
);

-- Создание таблицы "Рейсы"
CREATE TABLE Flights (
    FlightID INT PRIMARY KEY IDENTITY,
    DepartureAirport NVARCHAR(3) NOT NULL,
    ArrivalAirport NVARCHAR(3) NOT NULL,
    DepartureTime DATETIME NOT NULL,
    ArrivalTime DATETIME NOT NULL,
    AirplaneID INT REFERENCES Airplanes(AirplaneID)
);

-- Создание таблицы "Пассажиры"
CREATE TABLE Passengers (
    PassengerID INT PRIMARY KEY IDENTITY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PassportNumber NVARCHAR(20) NOT NULL UNIQUE,
    BirthDate DATE NOT NULL
);

-- Создание таблицы "Билеты"
CREATE TABLE Tickets (
    TicketID INT PRIMARY KEY IDENTITY,
    FlightID INT REFERENCES Flights(FlightID),
    PassengerID INT REFERENCES Passengers(PassengerID),
    SeatNumber NVARCHAR(4) NOT NULL,
    TicketClass NVARCHAR(20) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL
);

-- Создание таблицы "Сотрудники"
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Position NVARCHAR(50) NOT NULL,
    HireDate DATE NOT NULL
);

-- Создание таблицы "Экипажи"
CREATE TABLE Crews (
    CrewID INT PRIMARY KEY IDENTITY,
    FlightID INT REFERENCES Flights(FlightID),
    EmployeeID INT REFERENCES Employees(EmployeeID),
    Role NVARCHAR(50) NOT NULL
);




-- Создание таблицы "Корзина(для покупок)"
CREATE TABLE ShoppingCart (
    ItemID INT PRIMARY KEY IDENTITY,
    FlightID INT REFERENCES Flights(FlightID),
    PassengerID INT REFERENCES Passengers(PassengerID),
    SeatNumber NVARCHAR(4) NOT NULL,
    TicketClass NVARCHAR(20) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL
);

--=============================================================--
--==========================Процедуры==========================--
--=============================================================--


--==========================Самолёты===========================--

SELECT * FROM Airplanes
-- Добавление нового самолета
EXEC AddAirplane @Model = 'Airbus A321', @Capacity = 220, @ProductionYear = '2018-01-01';

--Изменение самолёта по его ID
EXEC UpdateAirplane @AirplaneID = 1, @Model = 'Airbus A121', @Capacity = 230, @ProductionYear = '2018-01-01';

-- Удаление самолета с ID = 1
EXEC DeleteAirplane @AirplaneID = 1;

-- Получение списка всех самолетов
EXEC GetAllAirplanes;

-- Добавление случайного самолета
EXEC AddRandomAirplane;

-- Удаление всех записей из таблицы Airplanes
EXEC DeleteAllAirplanes;


-- Сброс счетчика IDENTITY и перезапуск с 1
DBCC CHECKIDENT ('Airplanes', RESEED, 0);
GO
DELETE FROM Airplanes


--===========================Рейсы=============================--
EXECUTE AS USER = 'Customers'
-- Добавление нового рейса
EXEC AddFlight 'RTG', 'JFK', '2024-01-15T10:00:00', '2024-01-15T14:30:00', 1;

-- Обновление времени вылета существующего рейса
EXEC UpdateFlight 1, 'RTG', 'JFK', '2024-01-15T11:00:00', '2024-01-15T15:30:00', 1;

-- Удаление рейса
EXEC DeleteFlight 1;

-- Получение информации о рейсе по ID
EXEC GetFlightByID 1;

-- Получение списка всех рейсов
EXEC GetAllFlights;

-- Получение списка рейсов из аэропорта
EXEC GetFlightsByAirport 'RTG';

-- Получение списка рейсов на 15 января 2024
EXEC GetFlightsByDate '2024-01-15';

EXEC AddRandomFlight

DBCC CHECKIDENT ('Flights', RESEED, 0);
GO

DELETE FROM Flights
--================Пассажиры============--


-- Добавление нового пассажира
EXEC AddPassenger @FirstName = 'John', @LastName = 'Doe', @PassportNumber = '1234567890', @BirthDate = '1980-03-10';

-- Обновление информации о пассажире
EXEC UpdatePassenger @PassengerID = 1, @FirstName = 'John',  @LastName = 'Smith', @PassportNumber = '1234567890', @BirthDate = '1980-03-10';

-- Удаление пассажира
EXEC DeletePassenger @PassengerID = 1;

-- Получение информации о пассажире по ID
EXEC GetPassengerByID @PassengerID = 1;

-- Получение списка всех пассажиров
EXEC GetAllPassengers;

-- Получение информации о пассажире по номеру паспорта
EXEC GetPassengerByPassport @PassportNumber = '1234567890';

-- Добавление случайных пассажиров

EXEC AddRandomPassenger;

-- Сброс счетчика IDENTITY и перезапуск с 1
DBCC CHECKIDENT ('Passengers', RESEED, 0);
GO

DELETE FROM Passengers

--=====================Билеты=============================--
-- Добавление нового билета
EXEC AddTicket @FlightID = 1, @PassengerID = 5, @SeatNumber = '12A', @TicketClass = 'Economy', @Price = 250.00;

-- Обновление информации о билете
EXEC UpdateTicket @TicketID = 1, @FlightID = 1, @PassengerID = 5, @SeatNumber = '12A', @TicketClass = 'Business', @Price = 500.00; 

-- Удаление билета
EXEC DeleteTicket @TicketID = 1;

-- Получение информации о билете по ID
EXEC GetTicketByID @TicketID = 1;

-- Получение списка всех билетов
EXEC GetAllTickets;

-- Получение списка билетов на рейс с ID
EXEC GetTicketsByFlight @FlightID = 1;

-- Получение списка билетов, купленных пассажиром с ID 1
EXEC GetTicketsByPassenger @PassengerID = 1;

-- Добавление случайных билетов
DECLARE @i INT = 1;
WHILE @i <= 50
BEGIN
    EXEC AddRandomTicket;
    SET @i = @i + 1;
END;

DBCC CHECKIDENT ('Tickets', RESEED, 0);
GO

DELETE FROM Tickets

--=============Сотрудники================--

-- Добавление нового сотрудника
EXEC AddEmployee @FirstName = 'Anna', @LastName = 'Petrova', @Position = 'Flight attendant', @HireDate = '2020-05-15';

-- Обновление информации о сотруднике
EXEC UpdateEmployee @EmployeeID = 1, @FirstName = 'Anna', @LastName = 'Petrova', @HireDate = '2020-05-15', @Position = 'Copilot'; 

-- Удаление сотрудника
EXEC DeleteEmployee @EmployeeID = 1;

-- Получение информации о сотруднике по ID
EXEC GetEmployeeByID @EmployeeID = 1;

-- Получение списка всех сотрудников
EXEC GetAllEmployees;

-- Получение списка пилотов
EXEC GetEmployeesByPosition @Position = 'Copilot';

-- Добавление случайных сотрудников
DECLARE @i INT = 1;
WHILE @i <= 20
BEGIN
    EXEC AddRandomEmployee;
    SET @i = @i + 1;
END;

DBCC CHECKIDENT ('Employees', RESEED, 0);
GO

DELETE FROM Employees

--================Экипаж===============--

-- Добавление члена экипажа к рейсу
EXEC AddCrewMember @FlightID = 1, @EmployeeID = 5, @Role = 'Flight attendant';

-- Обновление роли члена экипажа
EXEC UpdateCrewMember @CrewID = 1, @Role = 'Senior flight attendant';

-- Удаление члена экипажа из рейса
EXEC DeleteCrewMember @CrewID = 1;

-- Получение списка экипажа для рейса с ID 5
EXEC GetCrewByFlight @FlightID = 1;

-- Добавление случайного экипажа к рейсу с ID 10
EXEC AddRandomCrew @FlightID = 5;



DBCC CHECKIDENT ('Crews', RESEED, 0);
GO

DELETE FROM Crews
--==================Функции======================--

-- Получение возраста самолета с ID 2
SELECT dbo.GetAirplaneAge(2) AS AirplaneAge;

-- Проверка доступности самолета с ID 1 на определенный период
DECLARE @Available BIT;
SET @Available = dbo.IsAirplaneAvailable(1, '20231220', '20240105'); -- Изменен формат дат
SELECT CASE WHEN @Available = 1 THEN 'Available' ELSE 'Not available' END AS Availability;

-- Получение общей вместимости всех самолетов
SELECT dbo.GetTotalCapacity() AS TotalCapacity;

-- Получение среднего возраста всех самолетов
SELECT dbo.GetAverageAirplaneAge() AS AverageAge;


-- Получение продолжительности рейса с ID 10
SELECT dbo.GetFlightDuration(5) AS FlightDuration;

-- Проверка наличия свободных мест в бизнес-классе на рейсе с ID 5
DECLARE @SeatsAvailable BIT;
SET @SeatsAvailable = dbo.AreSeatsAvailable(3, 'Business');
SELECT CASE WHEN @SeatsAvailable = 1 THEN 'Seats available' ELSE 'No seats available' END AS Availability;


-- Получение полного имени пассажира с ID
SELECT dbo.GetPassengerFullName(5) AS PassengerName;

-- Проверка совершеннолетия пассажира с ID
DECLARE @IsAdult BIT;
SET @IsAdult = dbo.IsPassengerAdult(6);
SELECT CASE WHEN @IsAdult = 1 THEN 'Adult' ELSE 'Minor' END AS AgeStatus;

-- Получение общего количества проданных билетов
SELECT dbo.GetTotalTicketsSold() AS TotalTicketsSold;

-- Получение общей выручки от продажи билетов на рейс с ID 15
SELECT dbo.GetRevenueByFlight(1) AS FlightRevenue;

-- Получение аэропорта назначения, в который было продано больше всего билетов
SELECT dbo.GetMostPopularDestination() AS MostPopularDestination;

-- Получение средней цены билета
SELECT dbo.GetAverageTicketPrice() AS AverageTicketPrice;

-- Получение стажа работы сотрудника с ID 12
SELECT dbo.GetEmployeeExperience(12) AS EmployeeExperience;

-- Получение количества пилотов
SELECT dbo.GetTotalEmployeesByPosition('Pilot') AS NumberOfPilots;

SELECT dbo.IsCrewComplete(1) AS IsComplete;

--================Тестирование триггеров================--



select * from Airplanes;
select * from Passengers;
select * from Employees;
select * from Crews;
select * from Tickets;
select * from Flights;
select * from ShoppingCart

Delete from Airplanes;
Delete from Passengers;
Delete from Employees;
Delete from Crews;
Delete from Tickets;
Delete from Flights;
Delete from ShoppingCart;



-- Вызов процедуры для добавления билета в корзину
EXEC AddToShoppingCart @FlightID, @PassengerID, @SeatNumber, @TicketClass, @Price;

DECLARE @TicketID INT = 2;

-- Вызов процедуры для обработки билета в корзине
EXEC ProcessTicket @TicketID;

EXEC GetAllAirplanes;
EXECUTE AS as user = 'Customer'

select current_user;
revert;
exec GetAllEmployees;
select * from Airplanes

SELECT DISTINCT local_tcp_port
FROM sys.dm_exec_connections
WHERE local_tcp_port IS NOT NULL;


--===============Тестирование БД=======================--
--Чистим всё
EXEC TotalPurge;


--Создаём Самолёт

-- Добавление нового самолета
EXEC AddAirplane @Model = 'Airbus A321', @Capacity = 220, @ProductionYear = '2018-01-01';
--Изменение самолёта по его ID
EXEC UpdateAirplane @AirplaneID = 1, @Model = 'Airbus A121', @Capacity = 230, @ProductionYear = '2018-01-01';
-- Удаление самолета с ID = 1
EXEC DeleteAirplane @AirplaneID = 1;

-- Получение списка всех самолетов
EXEC GetAllAirplanes;


--Оформляем рейс
EXEC AddFlight 'RTG', 'JFK', '2024-10-15T10:00:00', '2024-10-15T14:30:00', 1;
EXEC GetAllFlights;

--Добавляем сотрудников и создаём экипаж
-- Добавление случайных сотрудников
DECLARE @i INT = 1;
WHILE @i <= 6
BEGIN
    EXEC AddRandomEmployee;
    SET @i = @i + 1;
END;
EXEC GetAllEmployees;

-- Добавление случайного экипажа к рейсу с ID 1
EXEC AddRandomCrew @FlightID = 1;
EXEC GetAllCrew @FlightID = 1;

--Регестрируем пользователя
EXEC AddPassenger @FirstName = 'John', @LastName = 'Doe', @PassportNumber = '1234567890', @BirthDate = '1980-03-10';

EXEC GetAllPassengers;
--Пользователь добавляет билет в корзину

EXEC AddToShoppingCart @FlightID = 1, @PassengerID = 1, @SeatNumber = 'A23', @TicketClass = 'First', @Price = '200.0';

EXEC GetAllTickets;
--Менеджер оформляет билет

EXEC ProcessTicket @TicketID = 2;

EXEC GetAllCartData;
EXEC GetAllTickets;


DECLARE @airplaneCount INT = 1;
WHILE @airplaneCount <= 8
BEGIN
    EXEC AddRandomAirplane;
    SET @airplaneCount = @airplaneCount + 1;
END;

-- Flights (20,000)
DECLARE @flightCount INT = 1;
WHILE @flightCount <= 15
BEGIN
    EXEC AddRandomFlight;
    SET @flightCount = @flightCount + 1;
END;

-- Passengers (80,000)
DECLARE @passengerCount INT = 1;
WHILE @passengerCount <= 20
BEGIN
    EXEC AddRandomPassenger;
    SET @passengerCount = @passengerCount + 1;
END;

-- Tickets 
DECLARE @ticketCount INT = 1;
WHILE @ticketCount <= 1
BEGIN
    EXEC AddRandomTicket;
    SET @ticketCount = @ticketCount + 1;
END;

-- Employees (50)
DECLARE @employeeCount INT = 1;
WHILE @employeeCount <= 15
BEGIN
    EXEC AddRandomEmployee;
    SET @employeeCount = @employeeCount + 1;
END;

-- Crews (7 Fully Staffed Teams)
DECLARE @crewCount INT = 1;
WHILE @crewCount <= 2
BEGIN
    DECLARE @randomFlightID INT;
    SELECT TOP 1 @randomFlightID = FlightID FROM Flights ORDER BY NEWID();
    EXEC AddRandomCrew @FlightID = @randomFlightID;
    SET @crewCount = @crewCount + 1;
END;
SELECT * FROM ShoppingCart;
EXEC SortTable @TableName = 'Employees', @ColumnName = 'LastName', @SortOrder = 'DESC';
EXEC GetAllPassengers;
EXEC GetAllFlights;
EXEC GetAllTickets;

EXEC GetAllAirplanes
EXEC TotalPurge;
SELECT * FROM ShoppingCart







-- Airplanes (800)
DECLARE @airplaneCount INT = 1;
WHILE @airplaneCount <= 800
BEGIN
    EXEC AddRandomAirplane;
    SET @airplaneCount = @airplaneCount + 1;
END;

-- Flights (300)
DECLARE @flightCount INT = 1;
WHILE @flightCount <= 300
BEGIN
    EXEC AddRandomFlight;
    SET @flightCount = @flightCount + 1;
END;

-- Passengers (4000)
DECLARE @passengerCount INT = 1;
WHILE @passengerCount <= 4000
BEGIN
    EXEC AddRandomPassenger;
    SET @passengerCount = @passengerCount + 1;
END;

-- Tickets (3000)
DECLARE @ticketCount INT = 1;
WHILE @ticketCount <= 3000
BEGIN
    EXEC AddRandomTicket;
    SET @ticketCount = @ticketCount + 1;
END;

-- Employees (1000)
DECLARE @employeeCount INT = 1;
WHILE @employeeCount <= 1000
BEGIN
    EXEC AddRandomEmployee;
    SET @employeeCount = @employeeCount + 1;
END;

-- Crews (27)
DECLARE @crewCount INT = 1;
WHILE @crewCount <= 27
BEGIN
    DECLARE @randomFlightID INT;
    SELECT TOP 1 @randomFlightID = FlightID FROM Flights ORDER BY NEWID();
    EXEC AddRandomCrew @FlightID = @randomFlightID;
    SET @crewCount = @crewCount + 1;
END;

exec GetAllAirplanes
exec GetAllCrew @FlightID = 1;
exec GetAllEmployees
exec GetAllFlights
exec GetAllPassengers
exec GetAllTickets
exec GetAllCartData

