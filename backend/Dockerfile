# Use the official .NET 8.0 SDK image as the build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Set the working directory inside the container
WORKDIR /app

# Copy the project file(s) and restore dependencies
COPY *.csproj ./ 
RUN dotnet restore


# Copy the rest of the application code
COPY . ./



# Publish the application
RUN dotnet publish -c Release -o /out

# Use the official .NET 8.0 ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory inside the container
WORKDIR /app

# Copy the published output from the build environment
COPY --from=build-env /out ./

# Expose the application on port 5041
EXPOSE 5041

# Set the entry point for the container
ENTRYPOINT ["dotnet", "KubeBookStore.dll"]
