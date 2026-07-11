import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { product as productRoute } from '@/routes';
import { show } from '@/routes/product';
import type { BreadcrumbItem } from "@/types"
import type { Product } from '@/types/product';
import ShowIndex from '@/components/khaslana/product/show/show-index';

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({
    product,
}: ProductShowProps) {
    const { user } = useAuth();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Product',
            href: productRoute().url,
        },
        {
            title: 'Detail Produk',
            href: show(product.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Detail Produk' />
            {!user.is_umkm ? (
                <CtaCard />   
            ) : (
                <>
                    {/* header */}
                    <div className="flex flex-col align-items-center gap-3">
                        <Link
                            href={productRoute()}
                            className='flex items-center gap-1 group w-fit'
                        >
                            <ChevronLeft className='h-5 w-5 text-[#99FF33] group-hover:text-white transition-colors duration-200' />
                            <span className='text-base text-[#99FF33] group-hover:text-white transition-colors duration-200'>Kembali</span>
                        </Link>
                        <h1 className="text-3xl font-bold">
                            Detail Produk
                        </h1>
                    </div>
        
                    {/* content */}
                    <ShowIndex product={product} />
                </>
            )}
        </AppLayout>
    )
}