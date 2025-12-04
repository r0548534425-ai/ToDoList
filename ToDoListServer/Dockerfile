# שלב 1: בנייה (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# מעתיקים את קובץ הפרויקט (הוא נמצא ליד ה-Dockerfile ולכן אין צורך בנתיב ארוך)
COPY ToDoListServer.csproj ./
# משחזרים חבילות
RUN dotnet restore

# מעתיקים את שאר הקבצים מהתיקייה הנוכחית
COPY . ./
# בונים את הפרויקט לתיקיית out
RUN dotnet publish -c Release -o out

# שלב 2: הרצה (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# הגדרת הפקודה שתריץ את השרת
ENTRYPOINT ["dotnet", "ToDoListServer.dll"]