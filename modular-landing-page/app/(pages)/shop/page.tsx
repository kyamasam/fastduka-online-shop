import { getTheme } from '@/app/lib/get-theme';
import { getThemePageComponent } from '@/app/lib/theme-loader';

// Default shop page - used when theme doesn't have an override
function DefaultShopPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
                <p className="font-bold">📦 Default Theme - Shop Page</p>
                <p className="text-sm">This is the default shop page from app/(pages)/shop/page.tsx</p>
            </div>
            <h1 className="text-3xl font-bold mb-6">Shop</h1>
            <p>Default shop content goes here...</p>
        </div>
    )
}

// Server Component - SSR with theme override support
export default async function ShopPage() {
    // Fetch theme on server side
    const themeName = await getTheme();

    // Check if theme has an override for this page
    const { Component, isOverride } = await getThemePageComponent(themeName, 'shop');

    // If theme has override, render it; otherwise render default
    if (isOverride && Component) {
        return <Component />;
    }

    return <DefaultShopPage />;
}