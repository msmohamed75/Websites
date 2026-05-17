using System.Data;
using Dapper;
using MySqlConnector;
using Crescent.AdminApi.Models;

namespace Crescent.AdminApi.Data;

public sealed class CrescentRepository(IConfiguration configuration)
{
    private IDbConnection CreateConnection() => new MySqlConnection(configuration.GetConnectionString("CrescentDb"));

    public async Task<HomeContentDto?> GetHomeContentAsync()
    {
        using var db = CreateConnection();
        var home = await db.QuerySingleOrDefaultAsync<HomeContentDto>(@"
            SELECT eyebrow Eyebrow, title Title, intro Intro, mission_title MissionTitle, mission Mission, image_url ImageUrl
            FROM home_content WHERE id = 1;");
        if (home is null) return null;
        var topics = await db.QueryAsync<string>("SELECT topic FROM home_topics WHERE home_content_id = 1 ORDER BY sort_order, id;");
        home.Topics = topics.ToList();
        return home;
    }

    public async Task SaveHomeContentAsync(HomeContentDto content)
    {
        using var db = CreateConnection();
        db.Open();
        using var tx = db.BeginTransaction();
        await db.ExecuteAsync(@"
            INSERT INTO home_content (id, eyebrow, title, intro, mission_title, mission, image_url)
            VALUES (1, @Eyebrow, @Title, @Intro, @MissionTitle, @Mission, @ImageUrl)
            ON DUPLICATE KEY UPDATE eyebrow=@Eyebrow, title=@Title, intro=@Intro, mission_title=@MissionTitle, mission=@Mission, image_url=@ImageUrl;", content, tx);
        await db.ExecuteAsync("DELETE FROM home_topics WHERE home_content_id = 1;", transaction: tx);
        for (var i = 0; i < content.Topics.Count; i++)
            await db.ExecuteAsync("INSERT INTO home_topics (home_content_id, sort_order, topic) VALUES (1, @SortOrder, @Topic);", new { SortOrder = i, Topic = content.Topics[i] }, tx);
        tx.Commit();
    }

    public async Task<IEnumerable<BusinessUnitDto>> GetBusinessUnitsAsync()
    {
        using var db = CreateConnection();
        var units = (await db.QueryAsync<BusinessUnitDto>(@"
            SELECT id Id, slug Slug, name Name, icon Icon, image_url ImageUrl, image_360_url Image360Url,
                   description Description, accent_color AccentColor, is_coming_soon IsComingSoon, sort_order SortOrder
            FROM business_units WHERE is_active = TRUE ORDER BY sort_order, id;")).ToList();
        foreach (var unit in units)
        {
            unit.Features = (await db.QueryAsync<string>("SELECT feature FROM business_unit_features WHERE business_unit_id=@Id ORDER BY sort_order, id;", unit)).ToList();
            unit.SupportedBases = (await db.QueryAsync<string>(@"
                SELECT mb.name FROM business_unit_supported_bases bus
                JOIN master_bases mb ON mb.id = bus.base_id
                WHERE bus.business_unit_id=@Id ORDER BY mb.sort_order, mb.name;", unit)).ToList();
            unit.SupportedTypes = (await db.QueryAsync<string>(@"
                SELECT mbt.name FROM business_unit_supported_base_types bus
                JOIN master_base_types mbt ON mbt.id = bus.base_type_id
                WHERE bus.business_unit_id=@Id ORDER BY mbt.sort_order, mbt.name;", unit)).ToList();
            unit.SupportedPacks = (await db.QueryAsync<string>(@"
                SELECT mp.name FROM business_unit_supported_packs bus
                JOIN master_packs mp ON mp.id = bus.pack_id
                WHERE bus.business_unit_id=@Id ORDER BY mp.sort_order, mp.name;", unit)).ToList();
            unit.Images = (await db.QueryAsync<BusinessUnitImageDto>(@"
                SELECT id Id, image_url ImageUrl, alt_text AltText, is_primary IsPrimary, is_360 Is360, sort_order SortOrder
                FROM business_unit_images WHERE business_unit_id=@Id ORDER BY sort_order, id;", unit)).ToList();
        }
        return units;
    }

    public async Task SaveBusinessUnitsAsync(IEnumerable<BusinessUnitDto> units)
    {
        using var db = CreateConnection();
        db.Open();
        using var tx = db.BeginTransaction();
        await db.ExecuteAsync("SET FOREIGN_KEY_CHECKS = 0;", transaction: tx);
        await db.ExecuteAsync(@"DELETE FROM business_unit_features;
            DELETE FROM business_unit_images;
            DELETE FROM business_unit_supported_bases;
            DELETE FROM business_unit_supported_base_types;
            DELETE FROM business_unit_supported_packs;
            DELETE FROM business_units;", transaction: tx);
        await db.ExecuteAsync("SET FOREIGN_KEY_CHECKS = 1;", transaction: tx);

        var sort = 0;
        foreach (var unit in units)
        {
            var slug = string.IsNullOrWhiteSpace(unit.Slug) ? Slugify(unit.Name) : unit.Slug;
            var id = await db.ExecuteScalarAsync<long>(@"
                INSERT INTO business_units (slug, name, icon, image_url, image_360_url, description, accent_color, is_coming_soon, sort_order)
                VALUES (@Slug, @Name, @Icon, @ImageUrl, @Image360Url, @Description, @AccentColor, @IsComingSoon, @SortOrder);
                SELECT LAST_INSERT_ID();", new { unit.Name, unit.Icon, unit.ImageUrl, unit.Image360Url, unit.Description, unit.AccentColor, unit.IsComingSoon, Slug = slug, SortOrder = sort++ }, tx);

            for (var i = 0; i < unit.Features.Count; i++)
                await db.ExecuteAsync("INSERT INTO business_unit_features (business_unit_id, sort_order, feature) VALUES (@Id, @SortOrder, @Feature);", new { Id = id, SortOrder = i, Feature = unit.Features[i] }, tx);

            await SaveSupportedValuesAsync(db, tx, "master_bases", "business_unit_supported_bases", "base_id", id, unit.SupportedBases);
            await SaveSupportedValuesAsync(db, tx, "master_base_types", "business_unit_supported_base_types", "base_type_id", id, unit.SupportedTypes);
            await SaveSupportedValuesAsync(db, tx, "master_packs", "business_unit_supported_packs", "pack_id", id, unit.SupportedPacks);

            for (var i = 0; i < unit.Images.Count; i++)
                await db.ExecuteAsync(@"INSERT INTO business_unit_images (business_unit_id, image_url, alt_text, is_primary, is_360, sort_order)
                    VALUES (@Id, @ImageUrl, @AltText, @IsPrimary, @Is360, @SortOrder);", new { Id = id, unit.Images[i].ImageUrl, unit.Images[i].AltText, unit.Images[i].IsPrimary, unit.Images[i].Is360, SortOrder = i }, tx);
        }
        tx.Commit();
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync()
    {
        using var db = CreateConnection();
        var products = (await db.QueryAsync<ProductDto>(@"
            SELECT p.id Id, p.business_unit_id BusinessUnitId, bu.slug BusinessUnitSlug, p.product_name ProductName,
                   p.category Category, p.sub_category SubCategory, p.offers ShortDescription, p.description Description, p.price Price,
                   p.price_display PriceDisplay, p.offers Offers, p.image_url ImageUrl, p.sort_order SortOrder
            FROM products p
            LEFT JOIN business_units bu ON bu.id = p.business_unit_id
            WHERE p.is_active = TRUE ORDER BY p.sort_order, p.id;")).ToList();
        foreach (var product in products)
        {
            if (string.IsNullOrWhiteSpace(product.BusinessUnitSlug) && product.BusinessUnitId is > 0)
            {
                product.BusinessUnitSlug = await db.ExecuteScalarAsync<string?>(@"
                    SELECT slug FROM (
                        SELECT slug, ROW_NUMBER() OVER (ORDER BY sort_order, id) row_number
                        FROM business_units
                        WHERE is_active = TRUE
                    ) ordered_units
                    WHERE row_number=@BusinessUnitId;", product);
            }
            product.Features = (await db.QueryAsync<string>("SELECT feature FROM product_features WHERE product_id=@Id ORDER BY sort_order, id;", product)).ToList();
            product.PackagePrices = (await db.QueryAsync<ProductPackagePriceDto>("SELECT id Id, package_size PackageSize, price_display Price FROM product_package_sizes WHERE product_id=@Id ORDER BY sort_order, id;", product)).ToList();
            product.PackageSizes = product.PackagePrices.Select(p => p.PackageSize).ToList();
        }
        return products;
    }

    public async Task SaveProductsAsync(IEnumerable<ProductDto> products)
    {
        var productList = products.ToList();
        if (productList.Count == 1)
        {
            await SaveSingleProductAsync(productList[0]);
            return;
        }

        using var db = CreateConnection();
        db.Open();
        using var tx = db.BeginTransaction();
        await db.ExecuteAsync(@"DELETE FROM product_package_images;
            DELETE FROM product_features;
            DELETE FROM product_package_sizes;
            DELETE FROM products;", transaction: tx);
        var sort = 0;
        foreach (var product in productList)
        {
            await UpsertProductAsync(db, tx, product, sort++);
        }
        tx.Commit();
    }

    private async Task SaveSingleProductAsync(ProductDto product)
    {
        using var db = CreateConnection();
        db.Open();
        using var tx = db.BeginTransaction();
        await UpsertProductAsync(db, tx, product, product.SortOrder);
        tx.Commit();
    }

    private static async Task UpsertProductAsync(IDbConnection db, IDbTransaction tx, ProductDto product, int sortOrder)
    {
        var businessUnitId = product.BusinessUnitId;
        if (businessUnitId is null && !string.IsNullOrWhiteSpace(product.BusinessUnitSlug))
            businessUnitId = await db.ExecuteScalarAsync<long?>("SELECT id FROM business_units WHERE slug=@BusinessUnitSlug;", product, tx);

        var existingId = product.Id > 0 ? product.Id : await db.ExecuteScalarAsync<long?>(@"
            SELECT id FROM products
            WHERE ((@BusinessUnitId IS NULL AND business_unit_id IS NULL) OR business_unit_id=@BusinessUnitId)
              AND product_name=@ProductName
            ORDER BY id LIMIT 1;", new { BusinessUnitId = businessUnitId, product.ProductName }, tx);

        long id;
        if (existingId is > 0)
        {
            id = existingId.Value;
            await db.ExecuteAsync(@"
                UPDATE products
                SET business_unit_id=@BusinessUnitId, product_name=@ProductName, category=@Category, sub_category=@SubCategory,
                    description=@Description, price=@Price, price_display=@PriceDisplay, offers=@Offers, image_url=@ImageUrl, sort_order=@SortOrder, is_active=TRUE
                WHERE id=@Id;", new { Id = id, BusinessUnitId = businessUnitId, product.ProductName, product.Category, product.SubCategory, product.Description, product.Price, product.PriceDisplay, Offers = product.ShortDescription ?? product.Offers, product.ImageUrl, SortOrder = sortOrder }, tx);
        }
        else
        {
            id = await db.ExecuteScalarAsync<long>(@"
                INSERT INTO products (business_unit_id, product_name, category, sub_category, description, price, price_display, offers, image_url, sort_order)
                VALUES (@BusinessUnitId, @ProductName, @Category, @SubCategory, @Description, @Price, @PriceDisplay, @Offers, @ImageUrl, @SortOrder);
                SELECT LAST_INSERT_ID();", new { BusinessUnitId = businessUnitId, product.ProductName, product.Category, product.SubCategory, product.Description, product.Price, product.PriceDisplay, Offers = product.ShortDescription ?? product.Offers, product.ImageUrl, SortOrder = sortOrder }, tx);
        }

        await db.ExecuteAsync("DELETE FROM product_package_images WHERE product_package_size_id IN (SELECT id FROM product_package_sizes WHERE product_id=@Id);", new { Id = id }, tx);
        await db.ExecuteAsync("DELETE FROM product_features WHERE product_id=@Id; DELETE FROM product_package_sizes WHERE product_id=@Id;", new { Id = id }, tx);

        for (var i = 0; i < product.Features.Count; i++)
            await db.ExecuteAsync("INSERT INTO product_features (product_id, sort_order, feature) VALUES (@Id, @SortOrder, @Feature);", new { Id = id, SortOrder = i, Feature = product.Features[i] }, tx);

        var packagePrices = product.PackagePrices.Count > 0
            ? product.PackagePrices
            : product.PackageSizes.Select(size => new ProductPackagePriceDto { PackageSize = size, Price = product.PriceDisplay }).ToList();
        for (var i = 0; i < packagePrices.Count; i++)
        {
            var packageId = await db.ExecuteScalarAsync<long>(@"
                INSERT INTO product_package_sizes (product_id, sort_order, package_size, price_display)
                VALUES (@Id, @SortOrder, @PackageSize, @Price);
                SELECT LAST_INSERT_ID();", new { Id = id, SortOrder = i, packagePrices[i].PackageSize, packagePrices[i].Price }, tx);
            for (var imageIndex = 0; imageIndex < packagePrices[i].Images.Count; imageIndex++)
                await db.ExecuteAsync("INSERT INTO product_package_images (product_package_size_id, sort_order, image_url) VALUES (@PackageId, @SortOrder, @ImageUrl);", new { PackageId = packageId, SortOrder = imageIndex, ImageUrl = packagePrices[i].Images[imageIndex] }, tx);
        }
    }

    private static async Task SaveSupportedValuesAsync(IDbConnection db, IDbTransaction tx, string masterTable, string linkTable, string linkColumn, long businessUnitId, List<string> values)
    {
        for (var i = 0; i < values.Count; i++)
        {
            var value = values[i];
            if (string.IsNullOrWhiteSpace(value)) continue;
            await db.ExecuteAsync($"INSERT IGNORE INTO {masterTable} (name, sort_order) VALUES (@Name, @SortOrder);", new { Name = value, SortOrder = i }, tx);
            var masterId = await db.ExecuteScalarAsync<long>($"SELECT id FROM {masterTable} WHERE name=@Name;", new { Name = value }, tx);
            await db.ExecuteAsync($"INSERT IGNORE INTO {linkTable} (business_unit_id, {linkColumn}) VALUES (@BusinessUnitId, @MasterId);", new { BusinessUnitId = businessUnitId, MasterId = masterId }, tx);
        }
    }

    private static string Slugify(string value) => string.Join('-', value.Trim().ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries));
}

