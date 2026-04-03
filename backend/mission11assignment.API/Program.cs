using Microsoft.EntityFrameworkCore;
using mission11assignment.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Register MVC controllers, Swagger, and the SQLite database context
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

// Allow cross-origin requests from the React frontend
builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactApp",
    policy => {
        policy.WithOrigins("http://localhost:3000", "https://lively-ground-075c0531e.westus2.7.azurestaticapps.net", "https://lively-ground-075c0531e-preview.westus2.7.azurestaticapps.net")
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));

var app = builder.Build();

// Enable Swagger UI in development for easy API testing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply the named CORS policy for the React frontend (local + Azure)
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
