DELETE FROM Ticket;
DELETE FROM CounterService;
DELETE FROM Service;
DELETE FROM Counter;

INSERT INTO Service(serviceId, serviceName, serviceTime) VALUES (1, 'Bollettini', 6000);
INSERT INTO Service(serviceId, serviceName, serviceTime) VALUES (2, 'Spedizioni', 12000);
INSERT INTO Service(serviceId, serviceName, serviceTime) VALUES (3, 'Raccomandate', 36000);

INSERT INTO Counter(counterId) VALUES (1);
INSERT INTO Counter(counterId) VALUES (2);
INSERT INTO Counter(counterId) VALUES (3);

INSERT INTO CounterService(counterId, serviceId) VALUES (1, 1);
INSERT INTO CounterService(counterId, serviceId) VALUES (1, 2);
INSERT INTO CounterService(counterId, serviceId) VALUES (1, 3);
INSERT INTO CounterService(counterId, serviceId) VALUES (2, 1);
INSERT INTO CounterService(counterId, serviceId) VALUES (2, 2);
INSERT INTO CounterService(counterId, serviceId) VALUES (3, 1);

INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (1, DATE('now'), 1, 12000);
INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (2, DATE('now'), 2, 48000);
INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (3, DATE('now'), 3, 92000);