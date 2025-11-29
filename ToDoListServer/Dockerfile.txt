# שלב 1: שלב ה-Build (משתמש בסביבה עם כלי פיתוח של .NET)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# העתקת קובץ הפרויקט (הגשה 3.csproj) לשיקום תלויות
COPY ["ToDoListServer/הגשה 3.csproj", "ToDoListServer/"]
RUN dotnet restore "ToDoListServer/הגשה 3.csproj"

# העתקת כל הקוד והרצת Build
COPY . .
WORKDIR /src/ToDoListServer
RUN dotnet publish -c Release -o /app/publish --no-restore

# שלב 2: שלב הריצה (runtime) (משתמש בסביבה קלה יותר להרצה)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# הגדרת ה-URL של השרת בתוך הקונטיינר
ENV ASPNETCORE_URLS=http://+:8080

# הפעלת האפליקציה באמצעות ה-DLL הנכון
ENTRYPOINT ["dotnet", "הגשה 3.dll"]
# This is a final check line