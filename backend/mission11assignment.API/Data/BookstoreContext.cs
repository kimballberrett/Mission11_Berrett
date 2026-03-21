using Microsoft.EntityFrameworkCore;

namespace mission11assignment.API.Data;

/// <summary>
/// Entity Framework Core database context for the Bookstore SQLite database.
/// </summary>
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // Exposes the Books table for querying and manipulation
    public DbSet<Book> Books { get; set; }
}
