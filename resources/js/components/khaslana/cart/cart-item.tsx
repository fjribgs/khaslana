import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import DefaultProduct from "@/assets/images/product/default-product.png";
import { QuantityControl } from '@/components/khaslana/cart/quantity-control';
import DeleteConfirmationDialog from '@/components/khaslana/delete-confirmation-dialog';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
    item: CartItemType;
    isSelected: boolean;
    isEditMode: boolean;
    onSelectToggle: (id: number) => void;
    onQuantityChange: (id: number, newQuantity: number) => void;
    onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    isSelected,
    isEditMode,
    onSelectToggle,
    onQuantityChange,
    onRemove,
}) => {
    const variant = item.variant;
    const product = variant?.product;
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // 1. HARGA ASLI
    const originalPrice = variant?.price ?? 0;

    // 2. LOGIKA PERHITUNGAN DISKON
    let finalItemPrice = originalPrice;
    let isPromoActive = false;

    // Check Product tidak null
    const promoData = product?.promo;
    const promo = Array.isArray(promoData) ? promoData[0] : promoData;

    if (
        promo &&
        promo.status === 'BERLANGSUNG' &&
        promo.type === 'DISKON' &&
        promo.discount_percent
    ) {
        isPromoActive = true;
    
        finalItemPrice =
            originalPrice -
            (originalPrice * promo.discount_percent / 100);
    
        finalItemPrice = Math.max(0, finalItemPrice);
    }

    const totalPrice = finalItemPrice * item.quantity;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const variantAttributesText = variant?.attribute_values
        ?.map((attrValue) => {
            if (!attrValue.attribute?.name) return attrValue.value;
            return `${attrValue.attribute.name}: ${attrValue.value}`;
        })
        .join(', ');

    const imageUrl = product?.product_images?.[0]?.image
        ? `/storage/${product.product_images[0].image}`
        : DefaultProduct;

    return (
        <>
            <div
                className={`
                    flex items-stretch gap-4 p-3 rounded-xl transition-all duration-200
                    ${isSelected ? 'bg-[#29292e] shadow-md border border-[#3f3f46]' : 'bg-[#1a1a1e] hover:bg-[#202024] border border-transparent'}
                    ${isEditMode ? 'opacity-90' : 'opacity-100'}
                `}
            >
                {/* CHECKBOX */}
                <div className="flex items-center">
                    <div
                        className="relative flex items-center justify-center w-5 h-5 cursor-pointer"
                        onClick={() => onSelectToggle(item.id)}
                    >
                        <input
                            type="checkbox"
                            className="peer appearance-none w-5 h-5 border-2 border-[#4e4e54] rounded bg-transparent checked:bg-[#99ff33] checked:border-[#99ff33] transition-all cursor-pointer"
                            checked={isSelected}
                            readOnly
                        />
                        <svg
                            className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                            viewBox="0 0 14 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* GAMBAR PRODUK */}
                <div
                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => onSelectToggle(item.id)}
                >
                    <img
                        src={imageUrl}
                        alt={product?.name || "Product Image"}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* DETAIL PRODUK */}
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div
                        className="cursor-pointer space-y-1"
                        onClick={() => onSelectToggle(item.id)}
                    >
                        <h3 className="text-sm font-semibold text-white truncate pr-2 leading-tight">
                            {product?.name}
                        </h3>
                        {variantAttributesText && (
                            <p className="text-xs text-[#7c7c8a] truncate">
                                {variantAttributesText}
                            </p>
                        )}

                        {/* HARGA PER ITEM */}
                        <div className="flex flex-col">
                            {isPromoActive ? (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] text-[#7c7c8a] line-through">
                                        {formatCurrency(originalPrice)}
                                    </span>
                                    {promo?.type === 'DISKON' && (
                                        <span className="text-[10px] font-bold text-[#FF4444] bg-[#FF4444]/10 px-1.5 py-0.5 rounded">
                                            {promo.discount_percent}% OFF
                                        </span>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-2 self-start w-fit max-w-[120px]">
                        <QuantityControl
                            quantity={item.quantity}
                            stock={variant?.stock ?? 0}
                            onChange={(newQuantity) =>
                                onQuantityChange(item.id, newQuantity)
                            }
                        />
                    </div>
                </div>

                {/* ACTIONS & TOTAL PRICE */}
                <div className="flex flex-col items-end justify-between min-w-[90px]">
                    <button
                        type="button"
                        onClick={() => setIsDeleteOpen(true)}
                        className={`
                            p-1.5 rounded-md transition-all duration-200
                            bg-[#1a1a1e]
                            ${isEditMode
                                ? 'opacity-100 text-[#7c7c8a] hover:text-[#ff4444] hover:bg-[#261919]'
                                : 'opacity-0 pointer-events-none'
                            }
                        `}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-right mt-auto">
                        {isPromoActive ? (
                            <div className="text-[11px] text-[#7c7c8a] mb-1 font-medium">
                                {formatCurrency(finalItemPrice)} / unit
                            </div>
                        ) : (
                            <div className="text-[11px] text-[#7c7c8a] mb-1">
                                {formatCurrency(originalPrice)} / unit
                            </div>
                        )}
                        
                        <div className="text-lg font-bold text-[#99ff33]">
                            {formatCurrency(totalPrice)}
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationDialog
                open={isDeleteOpen}
                title="Hapus Produk?"
                description="Produk ini akan dihapus dari keranjang Anda."
                onCancel={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    onRemove(item.id);
                    setIsDeleteOpen(false);
                }}
            />
        </>
    );
};