import { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import LoginRequiredDialog from '@/components/khaslana/login-required-dialog';
import VariantDialog from '@/components/khaslana/catalog/detail/variant-dialog';
import type { Product } from '@/types/product';
import { umkm } from '@/routes';

interface UmkmSectionProps {
    products: Product[];
}

export default function UmkmSection({
    products,
}: UmkmSectionProps) {
    const { user } = useAuth();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [variantDialogOpen, setVariantDialogOpen] = useState(false);
    const formatPrice = (value: number) => new Intl.NumberFormat("id-ID").format(value);

    const handleAddToCart = (product: Product) => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        } else {
            setSelectedProduct(product);
            setVariantDialogOpen(true);
        }
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-screen h-auto py-5 mb-10 px-13.75 gap-7.5">
            <h2 className='font-medium text-3xl sm:text-4xl md:text-5xl text-center mt-8 mb-12 px-4 text-white'>
                Bersama Kami Menjadi Gerbang Digital{" "}
                <span className='text-[#99ff33]'>
                    UMKM Indonesia
                </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl mb-8 px-6">
                {products.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <PackageOpen className="h-32 w-32 text-[#99FF33] mb-4" />
                        <p className="text-white/80 text-sm md:text-base text-center">
                            Belum ada produk yang tersedia.
                        </p>
                    </div>
                ) : (
                    products.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-[#242424] border border-[#99FF33]/10 rounded-lg overflow-hidden"
                        >
                            <div className='relative overflow-hidden'>
                                <img
                                    src={
                                        item.product_images?.[0]?.image
                                        ? `/storage/${item.product_images?.[0].image}`
                                        : 'ilang'
                                    }
                                    alt={item.name}
                                    className="w-full h-52 sm:h-56 md:h-64 object-cover bg-white"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                            </div>
                            <div className="flex flex-col gap-2 p-5">
                                <h4 className="font-semibold text-[15px] md:text-base text-white">
                                    {item.name}
                                </h4>
                                <h4 className="text-[#99ff33] text-sm md:text-base">
                                    Rp {formatPrice(item.product_variants?.[0].price ?? 0)}
                                </h4>
                                <div className="flex items-center justify-center text-center border border-[#494847] py-2.5 w-full rounded-lg mt-2 text-white hover:border-[#99ff33] hover:cursor-pointer transition">
                                    <p onClick={() => handleAddToCart(item)} className="w-full text-[13px] md:text-sm">
                                        + Add to Cart
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-between items-center w-screen rounded-[50%] px-0 md:px-20 gap-7.5">
                <div className="h-px w-full bg-[#99ff33] flex-1"></div>
                <a href={umkm().url} className="btn-secondary-khaslana text-sm md:text-base">Lihat Semua</a>
                <div className="h-px w-full bg-[#99ff33] flex-1"></div>
            </div>

            {/* dialogs */}
            <LoginRequiredDialog
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
            />

            {selectedProduct && (
                <VariantDialog
                    key={`${selectedProduct.id}-add-cart`}
                    product={selectedProduct}
                    open={variantDialogOpen}
                    onClose={() => setVariantDialogOpen(false)}
                    actionType="add-cart"
                />
            )}
        </section>
    )
}