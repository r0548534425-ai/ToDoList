# שלב 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1. העתקת קובץ הפרויקט ושיקום תלויות
COPY ToDoListServer/ToDoListServer.csproj ./ToDoListServer/  <-- שם חדש כאן
RUN dotnet restore ./ToDoListServer/ToDoListServer.csproj    <-- שם חדש כאן

# 2. העתקת שאר הקוד והרצת Publish
COPY . .
WORKDIR /app/ToDoListServer
RUN dotnet publish -c Release -o /app/publish --no-restore

# שלב 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

# הפעלת האפליקציה באמצעות ה-DLL הנכון
ENTRYPOINT ["dotnet", "ToDoListServer.dll"] <-- שם חדש כאן