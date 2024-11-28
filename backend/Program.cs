using KubeBookStore.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://frontend:3000","http://localhost:3000","http://0.0.0.0:3000")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});




builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 23))));


builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
//Figure out why the token is not suited for H256
//var secretKey = builder.Configuration["Jwt:Key"];
//var keyBytes = Encoding.UTF8.GetBytes(secretKey);
//Console.WriteLine($"Key length in bytes: {keyBytes.Length} and the key is: {secretKey}");



builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("admin"));
    options.AddPolicy("RequireEditorRole", policy => policy.RequireRole("editor", "admin"));
    options.AddPolicy("RequireViewerRole", policy => policy.RequireRole("viewer", "editor", "admin"));
});



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddRazorPages();


var app = builder.Build();

// Apply migrations at application startup
using (var scope = app.Services.CreateScope())
{
    var DataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

    Console.WriteLine("Running init migrations");
    DataContext.Database.Migrate();
}

using (var scope = app.Services.CreateScope())
{
    await DbInit.SeedRolesAndAdminAsync(scope.ServiceProvider);
}



//// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}
app.UseCors();

//app.UseHttpsRedirection();

app.UseAuthentication();

//app.UseDefaultFiles();


app.MapControllers();
app.MapRazorPages();

app.UseRouting();
app.UseAuthorization();



app.Run();
