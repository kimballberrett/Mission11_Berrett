using Microsoft.AspNetCore.Mvc;
using mission11assignment.API.Data;

namespace mission11assignment.API.Controllers;

/// <summary>
/// API controller that exposes book data from the Bookstore database.
/// Supports pagination, sorting by title, and filtering by category.
/// </summary>
[Route("[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookstoreContext _context;

    public BookController(BookstoreContext temp) => _context = temp;

    /// <summary>
    /// Returns a paginated, sorted list of books, optionally filtered by category.
    /// </summary>
    /// <param name="pageSize">Number of books per page (default: 5)</param>
    /// <param name="pageNum">Page number to retrieve (default: 1)</param>
    /// <param name="sortOrder">Sort direction: "asc" or "desc" (default: "asc")</param>
    /// <param name="categories">Optional list of categories to filter by</param>
    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc",
        [FromQuery] List<string>? categories = null)
    {
        try
        {
            var query = _context.Books.AsQueryable();

            // Apply category filter before sorting or paginating
            if (categories != null && categories.Count > 0)
                query = query.Where(b => categories.Contains(b.Category));

            // Apply sort order
            query = sortOrder == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            // Count after filtering but before pagination for correct page count
            var totalNumBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { Books = books, TotalNumBooks = totalNumBooks });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving books: {ex.Message}");
        }
    }

    /// <summary>
    /// Returns the distinct list of book categories for the filter UI.
    /// </summary>
    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        try
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving categories: {ex.Message}");
        }
    }
}
