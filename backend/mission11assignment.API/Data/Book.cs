using System.ComponentModel.DataAnnotations;

namespace mission11assignment.API.Data;

/// <summary>
/// Represents a book record in the Bookstore database.
/// All fields are required to match the database schema.
/// </summary>
public class Book
{
    [Key]
    public int BookId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    public string Classification { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}
