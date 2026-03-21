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
builder.Services.AddCors();

var app = builder.Build();

// Enable Swagger UI in development for easy API testing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Restrict CORS to the local React dev server
app.UseCors(x => x.WithOrigins("http://localhost:3000"));

app.UseAuthorization();
app.MapControllers();

app.Run();
