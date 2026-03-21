using Microsoft.AspNetCore.Mvc;
using mission11assignment.API.Data;

namespace mission11assignment.API.Controllers;

/// <summary>
/// API controller that exposes book data from the Bookstore database.
/// Supports pagination and sorting by title.
/// </summary>
[Route("[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookstoreContext _context;

    public BookController(BookstoreContext temp) => _context = temp;

    /// <summary>
    /// Returns a paginated, sorted list of books.
    /// </summary>
    /// <param name="pageSize">Number of books per page (default: 5)</param>
    /// <param name="pageNum">Page number to retrieve (default: 1)</param>
    /// <param name="sortOrder">Sort direction: "asc" or "desc" (default: "asc")</param>
    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc")
    {
        var query = _context.Books.AsQueryable();

        // Apply sort order before paginating
        query = sortOrder == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Return both the page of books and the total count for pagination math
        var totalNumBooks = _context.Books.Count();

        return Ok(new { Books = books, TotalNumBooks = totalNumBooks });
    }
}
