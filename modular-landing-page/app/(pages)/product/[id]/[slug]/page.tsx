import ProductDetailClient from '@/components/product-details/ProductDetailClient';
import apiService from '@/services/api.service';
import { Product } from '@/types/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        id: string;
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const response = await apiService.get<Product>(`/api/product/${id}/`, {
            requiresAuth: false,
        });

        const product = response.data;

        return {
            title: `${product.name} - ${product.category.name}`,
            description: product.seo_description || product.description,
            // openGraph: {
            //     title: product.name,
            //     description: product.seo_description || product.description,
            //     images: [product.primary_photo],
            //     type: 'product',
            // },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.seo_description || product.description,
                images: [product.primary_photo],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id, slug } = await params;

    try {
        const response = await apiService.get<Product>(`/product/${id}/`, {
            requiresAuth: false,
        });

        const product = response.data;

        // Verify slug matches (optional redirect to correct slug)
        if (product.slug !== slug) {
            notFound();
        }

        return <ProductDetailClient product={product} />;
    } catch (error) {
        console.log("error****", error)
        notFound();
    }
}
