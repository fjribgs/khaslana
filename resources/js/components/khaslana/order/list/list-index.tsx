import { router } from "@inertiajs/react";
import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import type { Order } from "@/types/order";
import ConfirmationDialog from "../../confirmation-dialog";
import { order as orderRoute } from "@/routes";
import { show } from "@/routes/order";

interface ListIndexProps {
    orders: Order[];
}

export default function ListIndex({
    orders,
}: ListIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const formatRupiah = (value: number | undefined) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value ?? 0);

    const renderStatusBubble = (status: string) => {
        switch (status) {
            case 'TERTUNDA':
                return (
                    <div className="px-4 py-1.5 border border-orange-500 text-orange-400 bg-orange-500/10 rounded-full font-bold text-xs">TERTUNDA</div>
                )
            case 'MENUNGGU PEMBAYARAN':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">MENUNGGU PEMBAYARAN</div>
                )
            case 'DIBAYAR':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DIBAYAR</div>
                )
            case 'DALAM PROSES':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DALAM PROSES</div>
                )
            case 'DIKIRIM':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DIKIRIM</div>
                )
            case 'SIAP DIAMBIL':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">SIAP DIAMBIL</div>
                )
            case 'SELESAI':
                return (
                    <div className="px-4 py-1.5 border border-green-500 text-green-400 bg-orange-500/10 rounded-full font-bold text-xs">SELESAI</div>
                )
            default:
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-orange-500/10 rounded-full font-bold text-xs">DIBATALKAN</div>
                )
        }
    }

    const handleCompleteOrder = (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedOrderId(orderId);
        setIsDialogOpen(true);
    }
    
    const confirmCompleteOrder = () => {
        if (!selectedOrderId) return;

        router.patch(`/order/complete/${selectedOrderId}`, {}, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setSelectedOrderId(null);
                showSuccessToast("Pesanan berhasil diselesaikan");
            },
            onError: () => {
                setIsDialogOpen(false);
                setSelectedOrderId(null);
                showErrorToast("Terjadi error, silahkan coba lagi.")
            }
        })
    }

    return (
        <>
            <div className="mb-8">
                <span className="font-semibold text-4xl">
                    Riwayat <span className="text-[#99ff33]">Pesanan</span>
                </span>
            </div>
            <div className="flex flex-col gap-4 mb-20">
                {orders.map((order) => (
                    <a
                        href={order.status === 'TERTUNDA'
                            ? orderRoute(order.id).url
                            : show(order.id).url
                        }
                        className="
                            flex flex-col md:flex-row
                            gap-5
                            bg-[#131313]
                            p-5 md:p-8
                            rounded-3xl
                            justify-between
                            transition-all duration-200
                            hover:bg-[#222]
                            hover:-translate-y-0.5
                        "
                    >
                        <div className="flex gap-4 min-w-0 w-full">
                            <div className="w-28 h-28 md:w-36 md:h-36 shrink-0">
                                <img
                                    src={
                                        order.order_items?.[0].product?.product_images?.[0]?.image
                                            ? `/storage/${order.order_items?.[0].product?.product_images?.[0]?.image}`
                                            : '/images/placeholder.png'
                                    }
                                    alt={order.order_items?.[0].product_name}
                                    className="w-full h-full rounded-xl object-cover bg-white"
                                />
                            </div>
                            <div className="flex flex-col justify-between min-w-0">
                                <div className="space-y-1 min-w-0">
                                    <h5 className="font-semibold text-lg md:text-2xl break-words">
                                        {order.order_items?.[0].product_name}
                                    </h5>
                                    <span className="flex flex-col text-sm text-[#adaaaa]">
                                        <span className="break-words line-clamp-2">
                                            {order.order_items?.[0].variant_detail}
                                        </span>
                                        <span className="text-white">
                                            Kuantitas: {order.order_items?.[0].quantity} unit
                                        </span>
                                    </span>
                                </div>
                                <div className="w-fit mt-2">
                                    {renderStatusBubble(order.status)}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:items-end md:justify-between">
                            <div className="flex flex-col md:items-end">
                                <span className="text-[#adaaaa] font-medium text-sm">
                                    Total Belanja
                                </span>
                                <span className="text-[#99ff33] font-bold text-2xl md:text-3xl break-words">
                                    {formatRupiah(order.total_price)}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <a
                                    href={order.status === 'TERTUNDA'
                                        ? orderRoute(order.id).url
                                        : show(order.id).url
                                    }
                                    className="
                                        flex justify-center
                                        border border-[#99ff33]
                                        text-[#99ff33]
                                        px-4 py-2
                                        rounded-full mt-2
                                        text-sm font-semibold
                                        hover:text-black
                                        hover:bg-[#99ff33]
                                        transition-all duration-200
                                    "
                                >
                                    Lihat Detail
                                </a>
                                {(order.status == 'SIAP DIAMBIL' || order.status == 'DIKIRIM') && (
                                    <button
                                        onClick={(e) =>
                                            handleCompleteOrder(e, order.id)
                                        }
                                        className="
                                            flex justify-center
                                            border border-[#99ff33]
                                            bg-[#99ff33]
                                            text-black
                                            px-4 py-2
                                            rounded-full
                                            text-sm font-semibold
                                            hover:bg-transparent
                                            hover:text-[#99ff33]
                                            transition-all duration-200
                                            cursor-pointer
                                        "
                                    >
                                        Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <ConfirmationDialog 
                open={isDialogOpen}
                title="Selesaikan Pesanan Ini?"
                description="Pastikan Anda sudah menerima produk. Aksi ini tidak dapat dibatalkan"
                confirmText="Ya, Selesai"
                onConfirm={confirmCompleteOrder}
                onCancel={() => {
                    setIsDialogOpen(false);
                    setSelectedOrderId(null);
                }}
            />
        </>
    )
}