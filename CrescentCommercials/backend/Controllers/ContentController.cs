using Crescent.AdminApi.Data;
using Crescent.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace Crescent.AdminApi.Controllers;

[ApiController]
[Route("api/content")]
public sealed class ContentController(CrescentRepository repository) : ControllerBase
{
    [HttpGet("home")]
    public async Task<ActionResult<HomeContentDto>> GetHome() =>
        await repository.GetHomeContentAsync() is { } home ? Ok(home) : NotFound();

    [HttpPut("home")]
    public async Task<IActionResult> SaveHome(HomeContentDto content)
    {
        await repository.SaveHomeContentAsync(content);
        return NoContent();
    }

    [HttpGet("business-units")]
    public async Task<ActionResult<IEnumerable<BusinessUnitDto>>> GetBusinessUnits() =>
        Ok(await repository.GetBusinessUnitsAsync());

    [HttpPut("business-units")]
    public async Task<IActionResult> SaveBusinessUnits(IEnumerable<BusinessUnitDto> units)
    {
        await repository.SaveBusinessUnitsAsync(units);
        return NoContent();
    }

    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts() =>
        Ok(await repository.GetProductsAsync());

    [HttpPut("products")]
    public async Task<IActionResult> SaveProducts(IEnumerable<ProductDto> products)
    {
        await repository.SaveProductsAsync(products);
        return NoContent();
    }
}
