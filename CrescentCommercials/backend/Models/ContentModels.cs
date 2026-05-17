namespace Crescent.AdminApi.Models;

public sealed class HomeContentDto
{
    public string Eyebrow { get; set; } = "";
    public string Title { get; set; } = "";
    public string Intro { get; set; } = "";
    public string MissionTitle { get; set; } = "";
    public string Mission { get; set; } = "";
    public string? ImageUrl { get; set; }
    public List<string> Topics { get; set; } = [];
}

public sealed class BusinessUnitDto
{
    public long Id { get; set; }
    public string Slug { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? Image360Url { get; set; }
    public string? Description { get; set; }
    public string? AccentColor { get; set; }
    public bool IsComingSoon { get; set; }
    public int SortOrder { get; set; }
    public List<string> Features { get; set; } = [];
    public List<string> SupportedBases { get; set; } = [];
    public List<string> SupportedTypes { get; set; } = [];
    public List<string> SupportedPacks { get; set; } = [];
    public List<BusinessUnitImageDto> Images { get; set; } = [];
}

public sealed class BusinessUnitImageDto
{
    public long Id { get; set; }
    public string ImageUrl { get; set; } = "";
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public bool Is360 { get; set; }
    public int SortOrder { get; set; }
}

public sealed class ProductPackagePriceDto
{
    public long Id { get; set; }
    public string PackageSize { get; set; } = "";
    public string? Price { get; set; }
    public List<string> Images { get; set; } = [];
}

public sealed class ProductDto
{
    public long Id { get; set; }
    public long? BusinessUnitId { get; set; }
    public string? BusinessUnitSlug { get; set; }
    public string ProductName { get; set; } = "";
    public string? Category { get; set; }
    public string? SubCategory { get; set; }
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? PriceDisplay { get; set; }
    public string? Offers { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public List<string> Features { get; set; } = [];
    public List<string> PackageSizes { get; set; } = [];
    public List<ProductPackagePriceDto> PackagePrices { get; set; } = [];
}
