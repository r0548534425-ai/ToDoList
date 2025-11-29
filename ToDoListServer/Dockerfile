# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file and restore dependencies
COPY ToDoListServer/ToDoListServer.csproj ./ToDoListServer/
RUN dotnet restore ./ToDoListServer/ToDoListServer.csproj

# Copy the rest of the source code and publish
COPY . .
WORKDIR /app/ToDoListServer
# התיקון הקריטי: מוסיף פרמטר שימנע את שגיאת נתיב ה-Windows/NuGet
RUN dotnet publish -c Release -o /app/publish --no-restore /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Server configuration
ENV ASPNETCORE_URLS=http://+:8080

# Run the application
ENTRYPOINT ["dotnet", "ToDoListServer.dll"]