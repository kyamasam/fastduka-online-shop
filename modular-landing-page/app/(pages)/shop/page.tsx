import Breadcrumbs from '@/components/Breadcrumbs';
import { Pagination } from '@/components/shop/Pagination';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ShopFiltersWrapper } from '@/components/shop/ShopFiltersWrapper';
import { getTheme } from '@/lib/get-theme';
import { getCategories, getPriceRange, getProducts } from '@/lib/shop-api';
import { getThemePageComponent } from '@/lib/theme-loader';
import { ShopQueryParams } from '@/types/product';
import { Metadata } from 'next';

interface ShopPageProps {
    searchParams: Promise<{
        page?: string;
        ordering?: string;
        category_id?: string;
        on_sale?: string;
        in_stock?: string;
        selling_price__gte?: string;
        selling_price__lte?: string;
        search?: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
    const params = await searchParams;
    const page = params.page || '1';
    const categoryId = params.category_id;
    const searchTerm = params.search;

    let title = 'Shop';
    let description = 'Browse our collection of products';

    if (searchTerm) {
        title = `Search: ${searchTerm} | Shop`;
        description = `Search results for "${searchTerm}"`;
    } else if (categoryId) {
        title = `Products | Shop - Page ${page}`;
    } else {
        title = `All Products | Shop - Page ${page}`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

// Default shop page - used when theme doesn't have an override
async function DefaultShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    // Build query params from URL
    const queryParams: ShopQueryParams = {
        page: Number(params.page) || 1,
        ordering: params.ordering,
        category_id: params.category_id,
        on_sale: params.on_sale === 'true' ? true : undefined,
        in_stock: params.in_stock === 'true' ? true : undefined,
        selling_price__gte: params.selling_price__gte
            ? Number(params.selling_price__gte)
            : undefined,
        selling_price__lte: params.selling_price__lte
            ? Number(params.selling_price__lte)
            : undefined,
        search: params.search,
    };

    // Fetch data server-side
    const pageSize = 16;
    const [productsData, categories, priceRange] = await Promise.all([
        getProducts(queryParams, pageSize),
        getCategories(),
        getPriceRange(),
    ]);

    return (
        <div className='flex justify-center'>
            <div className='container flex-col items-start justify-start'>
                <div className=" mx-auto px-4 py-4">
                    <h1 style={{}} className="text-3xl font-bold">Shop</h1>
                    <Breadcrumbs child_page_label="Shop" />

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar with Mobile Support */}
                        <ShopFiltersWrapper categories={categories} priceRange={priceRange} />

                        {/* Main Content */}
                        <main className="flex-1">
                            <ProductGrid products={productsData.results} totalCount={productsData.count} />
                            <Pagination totalCount={productsData.count} pageSize={16} />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Server Component - SSR with theme override support
export default async function ShopPage(props: ShopPageProps) {
    // Fetch theme on server side
    const themeName = await getTheme();

    // Check if theme has an override for this page
    const { Component, isOverride } = await getThemePageComponent(themeName, 'shop');

    // If theme has override, render it; otherwise render default
    if (isOverride && Component) {
        return <Component />;
    }

    return <DefaultShopPage {...props} />;
}