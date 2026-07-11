import { router } from "@inertiajs/react";
import { ThumbsUp, Trash, MessageCircleX } from "lucide-react";
import { useState } from "react";

import DefaultProfile from "@/assets/icons/default-profile.png";
import { useAuth } from "@/hooks/use-auth";
import LoginRequiredDialog from '@/components/khaslana/login-required-dialog';
import DeleteConfirmationDialog from "@/components/khaslana/delete-confirmation-dialog";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import type { Product } from "@/types/product";
import { Textarea } from "@/components/ui/textarea";
import { deleteReview, likeReview } from "@/routes/catalog";

interface ProductDetailProps {
    product: Product;
}

export default function ReviewSection({
    product,
}: ProductDetailProps) {
    const { user } = useAuth();
    const reviews = product.reviews || [];

    const isMyReview = (reviewUserId: number) => {
        return user && reviewUserId === user.id
    }
    const hasReviewed = !!user && reviews.some(
        (review) => review.user.id === user.id
    );
    const hasPurchased = !!user &&
        product.order_items?.some(
            (item) =>
                item.order?.user_id === user.id &&
                item.order?.status === "SELESAI"
        );

    // const [isUploaded, setIsUploaded] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState<number>(5);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
    const [clampedReviews, setClampedReviews] = useState<Set<number>>(new Set());

    const handleSubmitReview = () => {
        if (!reviewText.trim()) {
            showErrorToast("Ulasan tidak boleh kosong!");
            return;
        }

        router.post(`/catalog/${product.id}/review`, {
            comment: reviewText,
            rating: rating,
        }, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setReviewText("");
                setRating(5);
                // setIsUploaded(true);

                // setTimeout(() => {
                //     setIsUploaded(false);
                // }, 3000);
                showSuccessToast("Ulasan berhasil diunggah!");
            }
        })
    };

    const handleCancelReview = () => {
        setReviewText('');
    }

    const handleDeleteReview = (reviewId: number) => {
        setSelectedReviewId(reviewId);
        setShowDeleteDialog(true);
    }

    const confirmDeleteReview = () => {
        if (!selectedReviewId) return;

        router.delete(
            deleteReview(selectedReviewId),
            {
                preserveScroll: true,
                onSuccess: () => {
                    showSuccessToast(
                        "Ulasan berhasil dihapus."
                    );
                },
            }
        );

        setShowDeleteDialog(false);
        setSelectedReviewId(null);
    };

    const handleLikeReview = (reviewId: number, is_liked: boolean) => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        } else {
            router.post(likeReview(reviewId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    if (!is_liked) {
                        showSuccessToast('Ulasan berhasil disukai!');
                    } else {
                        showSuccessToast('Disukai berhasil dibatalkan dari ulasan!');
                    }
                },
                onError: (err) => {
                    console.error("Gagal melakukan like ulasan: ", err);
                    showErrorToast('Ulasan gagal disukai');
                }
            })
        }
    };

    const toggleReview = (reviewId: number) => {
        setExpandedReviews((prev) => {
            const next = new Set(prev);

            if (next.has(reviewId)) {
                next.delete(reviewId);
            } else {
                next.add(reviewId);
            }

            return next;
        });
    };

    const checkClamped = (
        el: HTMLDivElement | null,
        reviewId: number
    ) => {
        if (!el) return;

        const isClamped = el.scrollHeight > el.clientHeight;

        setClampedReviews((prev) => {
            const alreadyClamped = prev.has(reviewId);

            if (alreadyClamped === isClamped) {
                return prev;
            }

            const next = new Set(prev);

            if (isClamped) {
                next.add(reviewId);
            } else {
                next.delete(reviewId);
            }
            return next;
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h3 className="font-bold text-3xl">Ulasan Pembeli</h3>
                <p className="font-medium text-[#adaaaa]">Apa kata mereka tentang kualitas produk ini.</p>
            </div>

            <div>
                <div className="relative flex flex-col items-center w-full">

                    {/* make a review */}
                    {user && hasPurchased && !hasReviewed && (
                        <div className="flex flex-col justify-between w-full p-3 gap-4 rounded-[15px]">
                            <div className="rating flex justify-center gap-1 w-full">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform active:scale-95 cursor-pointer text-6xl"
                                    >
                                        {star <= rating ? (
                                            <span className="text-yellow-400">★</span>
                                        ) : (
                                            <span className="text-gray-600">★</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-5 w-full">
                                <img
                                    src={user.profile_photo ?? DefaultProfile}
                                    alt="Profile"
                                    className="w-11 h-11 border border-white/10 rounded-full object-cover aspect-square"
                                />

                                <div className="flex items-center w-full min-w-0">
                                    <Textarea
                                        placeholder="Bagikan ulasan Anda..."
                                        rows={4}
                                        maxLength={1000}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="
                                            flex flex-1
                                            bg-transparent! rounded-none
                                            border-0 border-b border-b-white/10 outline-0
                                            text-white text-sm md:text-base
                                            focus-visible:ring-0
                                            focus-visible:border-b
                                            focus-visible:border-b-[#99FF33]/50
                                            transition-colors duration-200
                                        "
                                    />

                                </div>
                            </div>
                            <div className="mt-2 text-sm text-[#888] text-right">
                                {reviewText.length}/1000
                            </div>

                            <div
                                className={`
                                    flex relative items-center justify-end gap-3
                                    duration-200 transition-all
                                    ${reviewText !== ''
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-3'
                                    }
                                `}
                            >
                                <button
                                    onClick={() => handleCancelReview()}
                                    className='
                                        bg-muted py-2.5 px-8
                                        font-medium cursor-pointer
                                        rounded-[999px] text-muted-foreground
                                        hover:bg-muted-foreground hover:text-black
                                        transition-all duration-200
                                    '
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleSubmitReview()}
                                    className='
                                        bg-[#99FF33] border border-[#99FF33]
                                        py-2.5 px-8
                                        font-medium cursor-pointer
                                        rounded-[999px] text-black
                                        hover:bg-transparent hover:text-[#99ff33]
                                        transition-all duration-200
                                    '
                                >
                                    Kirim
                                </button>
                            </div>
                        </div>
                    )}
                    {user && hasReviewed && (
                        <div className="w-full bg-[#222] p-4 rounded-[15px] text-muted-foreground mb-6">
                            Anda sudah memberikan ulasan untuk produk ini.
                        </div>
                    )}
                    {user && !hasPurchased && (
                        <div className="w-full bg-[#222] p-4 rounded-[15px] text-muted-foreground mb-6">
                            Anda hanya dapat memberikan ulasan setelah membeli produk ini.
                        </div>
                    )}
                </div>

                <div
                    className={`
                        flex flex-col
                        gap-4 mt-12
                        duration-200 transition-all
                        ${reviewText !== ''
                            ? "translate-y-5"
                            : "-translate-y-10"
                        }
                    `}
                >
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className='flex flex-col gap-5 bg-[#222] p-8 rounded-3xl'>
                                <div className="flex items-center gap-5 w-full justify-between">
                                    <div className='flex gap-5 items-center ps-2'>
                                        <img
                                            src={user.profile_photo ?? DefaultProfile}
                                            alt="Profile"
                                            className="avatar w-10 h-10 max-md:w-8 max-md:h-8 rounded-full object-cover"
                                        />
                                        <div className="post-user flex flex-col">
                                            <h6 className="text-white font-medium text-lg">
                                                {review.user.name} {isMyReview(review.user.id) && (
                                                    <span className="text-xs text-muted-foreground">(Anda)</span>
                                                )}
                                            </h6>
                                            <p className="text-[#888] text-sm">
                                                {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                }) : "Baru saja"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex text-[#99ff33]">
                                        {"★".repeat(review.rating)}
                                    </div>
                                </div>

                                <div className="ps-3">
                                    <div
                                        ref={(el) => checkClamped(el, review.id)}
                                        className={`
                                            whitespace-pre-wrap
                                            break-words
                                            overflow-hidden
                                            text-white
                                            ${
                                                expandedReviews.has(review.id)
                                                    ? ''
                                                    : 'line-clamp-2'
                                            }
                                        `}
                                    >
                                        {review.comment}
                                    </div>

                                    {(clampedReviews.has(review.id) ||
                                        expandedReviews.has(review.id)) && (
                                        <button
                                            onClick={() => toggleReview(review.id)}
                                            className="
                                                mt-2
                                                text-[#99FF33]
                                                text-sm
                                                font-medium
                                                hover:underline
                                                cursor-pointer
                                            "
                                        >
                                            {expandedReviews.has(review.id)
                                                ? 'Tampilkan lebih sedikit'
                                                : 'Selengkapnya'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleLikeReview(review.id, review.is_liked)}
                                        className={`
                                            group
                                            flex items-center gap-2
                                            px-3 py-2
                                            rounded-xl
                                            text-sm font-medium
                                            cursor-pointer
                                            transition-all duration-300
                                            hover:bg-[#99FF33]/10
                                            active:scale-95
                                            ${review.is_liked
                                                ? 'text-[#99FF33] bg-[#99FF33]/10 shadow-[0_0_15px_rgba(153,255,51,0.15)]'
                                                : 'text-[#adaaaa]'
                                            }
                                        `}
                                    >
                                        <ThumbsUp
                                            className={`
                                                w-4 h-4
                                                transition-all duration-300
                                                group-hover:-translate-y-0.5
                                                group-hover:scale-125
                                                ${review.is_liked
                                                    ? "fill-[#99FF33] scale-110"
                                                    : ""
                                                }
                                            `}
                                        />
                                        {review.review_likes.length}
                                    </button>

                                    {isMyReview(review.user.id) && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className='
                                                flex items-center justify-center
                                                rounded-full aspect-square
                                                h-9 w-9 p-2
                                                hover:bg-white/20 hover:text-red-400
                                                transition-all duraion-300
                                                cursor-pointer
                                            '
                                        >
                                            <Trash className="w-4"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col w-full items-center justify-center text-[#adaaaa]">
                            <MessageCircleX className='h-20 w-20 text-center text-[#99FF33] mb-4' />
                            Belum ada ulasan terkait produk ini. Jadilah yg pertama mengulas!
                        </div>
                    )}
                </div>
            </div>

            {/* dialogs */}
            <LoginRequiredDialog
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
            />

            <DeleteConfirmationDialog
                open={showDeleteDialog}
                title="Hapus Ulasan"
                description="Apakah Anda yakin ingin menghapus ulasan ini?"
                onConfirm={confirmDeleteReview}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setSelectedReviewId(null);
                }}
            />
        </div>
    )
}