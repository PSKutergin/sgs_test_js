CREATE TABLE Containers (
    ID INT IDENTITY PRIMARY KEY,
    Number INT,
    Type NVARCHAR(MAX),
    Length FLOAT,
    Width FLOAT,
    Height FLOAT,
    Weight FLOAT,
    Empty BIT,
    Arrival_Date DATETIME
);

CREATE TABLE Operations (
    ID INT IDENTITY PRIMARY KEY,
    Container_ID INT,
    Start_DateTime DATETIME,
    End_DateTime DATETIME,
    Operation_Type NVARCHAR(MAX),
    Operator_Name NVARCHAR(MAX),
    Inspection_Place NVARCHAR(MAX),
    FOREIGN KEY (Container_ID) REFERENCES Containers(ID)
);

WITH JsonCTE AS (
    SELECT 
        '{"ID":' + CAST(ID AS NVARCHAR(MAX)) + 
        ',"Number":' + CAST(Number AS NVARCHAR(MAX)) +
        ',"Type":"' + Type + '"' +
        ',"Length":' + CAST(Length AS NVARCHAR(MAX)) +
        ',"Width":' + CAST(Width AS NVARCHAR(MAX)) +
        ',"Height":' + CAST(Height AS NVARCHAR(MAX)) +
        ',"Weight":' + CAST(Weight AS NVARCHAR(MAX)) +
        ',"Empty":' + CAST(Empty AS NVARCHAR(MAX)) +
        ',"Arrival_Date":"' + CONVERT(NVARCHAR(MAX), Arrival_Date, 120) + '"}' AS JsonString
    FROM Containers
)
SELECT 
    '[' + COALESCE(
        STRING_AGG(JsonString, ',') WITHIN GROUP (ORDER BY (SELECT NULL)), ''
    ) + ']' AS JsonOutput
FROM JsonCTE;


DECLARE @ContainerID INT = 123; -- ID конкретного контейнера

WITH JsonCTE AS (
    SELECT 
        '{"ID":' + CAST(ID AS NVARCHAR(MAX)) + 
        ',"Container_ID":' + CAST(Container_ID AS NVARCHAR(MAX)) + 
        ',"Start_DateTime":"' + CONVERT(NVARCHAR(MAX), Start_DateTime, 120) + '"' +
        ',"End_DateTime":"' + CONVERT(NVARCHAR(MAX), End_DateTime, 120) + '"' +
        ',"Operation_Type":"' + Operation_Type + '"' +
        ',"Operator_Name":"' + Operator_Name + '"' +
        ',"Inspection_Place":"' + Inspection_Place + '"}' AS JsonString
    FROM Operations
    WHERE Container_ID = @ContainerID
)
SELECT 
    '[' + COALESCE(
        (SELECT JsonString FROM JsonCTE FOR XML PATH('')), ''
    ) + ']' AS JsonOutput;