CREATE TABLE User (
    UserName TEXT (20) PRIMARY KEY,
    FullName TEXT (25),
    Password TEXT (100),
    Actived BOOLEAN NOT NULL DEFAULT (true)
);
CREATE TABLE GuestBook (
    Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    Relationship TEXT (25),
    ShortName TEXT (128),
    FullName TEXT (128),
    Phone TEXT (10),
    Description TEXT (256),
    Sent BOOLEAN DEFAULT (false) NOT NULL,
    GuestDate DATETIME,
    Agree BOOLEAN DEFAULT (false) NOT NULL,
    BusId NUMERIC,
    IsConfirmBus BOOLEAN DEFAULT (false) NOT NULL,
    IsConfirm BOOLEAN DEFAULT (false) NOT NULL,
    UserName TEXT (20) NOT NULL
);