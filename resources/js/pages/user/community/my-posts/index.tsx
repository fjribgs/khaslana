import { Link, router, Head } from "@inertiajs/react";
import {
    Plus,
    Trash,
    MessageCircleX,
    MessageCircleMore,
    ThumbsUp,
} from "lucide-react";
import { useState } from "react";

import ProfileIcon from "@/assets/icons/default-profile.png";
import DeleteConfirmationDialog from "@/components/khaslana/delete-confirmation-dialog";
import { useAuth } from "@/hooks/use-auth";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { community } from "@/routes";
import { create, show, destroy, like, myPosts } from "@/routes/community";
import type { BreadcrumbItem } from '@/types';
import type { Post } from "@/types/post";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Komunitas',
        href: community().url,
    },
    {
        title: 'Kelola Postingan',
        href: myPosts().url,
    },
];

interface MyPostsProps {
    posts: Post[];
}

export default function MyPosts({
    posts,
}: MyPostsProps) {
    const { user } = useAuth();
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
    const [clampedReviews, setClampedReviews] = useState<Set<number>>(new Set());

    const handleDeletePost = () => {
        if (!selectedPostId) return;

        router.delete(destroy(selectedPostId).url, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccessToast("Postingan berhasil dihapus");
                setIsDeleteDialogOpen(false);
                setSelectedPostId(null);
            },
            onError: () => {
                showErrorToast("Gagal menghapus postingan");
            },
        });
    };

    const openDeleteDialog = (postId: number) => {
        setSelectedPostId(postId);
        setIsDeleteDialogOpen(true);
    };

    const handleLike = (postId: number, is_liked: boolean) => {
        router.post(like(postId).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if(!is_liked) {
                    showSuccessToast("Berhasil menyukai postingan");
                }
            },
            onError: (err) => {
                console.error("Gagal melakukan like: ", err);
                showErrorToast("Gagal menyukai postingan");
            }
        })
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
        <UnusedNavLayout backHref={community().url} breadcrumbs={breadcrumbs}>
            <Head title='Postingan Anda'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <section className="community-header flex justify-between w-full pb-10 max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Kelola Postingan Anda</h2>
                <Link
                    href={create()}
                    className="
                        flex items-center
                        border border-[#99FF33] rounded-xl
                        bg-[#99FF33] hover:bg-transparent
                        py-2.5 px-5 gap-2 h-fit
                        font-medium text-black hover:text-[#99ff33]
                        text-sm md:text-base
                        cursor-pointer whitespace-nowrap
                        transition-all duration-200
                    "
                >
                    <Plus className="h-5 w-5 md:h-6 md:w-6" />
                    Buat Postingan
                </Link>
            </section>

            {posts && posts.length > 0 ? (
                posts.map((post) => {
                    const isMyPost = user && post.user_id === user.id;

                    return (
                        <Link
                            href={show(post.id)}
                            key={post.id}
                            className="w-full flex flex-col gap-4 bg-[#222] p-6 mb-12 rounded-[15px]"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center ps-2 gap-4">
                                        <img
                                            src={user.profile_photo ?? ProfileIcon}
                                            alt="Profile"
                                            className="w-11 h-11 border border-white/10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <h6 className="text-white font-medium text-lg">
                                                {post.user.name}
                                            </h6>
                                            <p className="text-[#888] text-xs md:text-sm">
                                                {post.post_date ? new Date(post.post_date).toLocaleDateString('id-ID', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                }) : "Baru saja"}
                                            </p>
                                        </div>
                                    </div>
                                    {isMyPost && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                openDeleteDialog(post.id)
                                            }}
                                            className="
                                                flex items-center justify-center
                                                rounded-full aspect-square
                                                h-9 w-9 p-2
                                                hover:bg-white/20 hover:text-red-400
                                                transition-all duraion-300
                                                cursor-pointer
                                            "
                                        >
                                            <Trash className="w-4 aspect-square"/>
                                        </button>
                                    )}
                                </div>

                                <div className="post-content flex flex-col ps-3 gap-5 text-[#adaaaa] font-normal">
                                    <div>
                                        <div
                                            ref={(el) => checkClamped(el, post.id)}
                                            className={`
                                                whitespace-pre-wrap
                                                break-words
                                                overflow-hidden
                                                text-white
                                                ${
                                                    expandedReviews.has(post.id)
                                                        ? ''
                                                        : 'line-clamp-2'
                                                }
                                            `}
                                        >
                                            {post.content}
                                        </div>

                                        {(clampedReviews.has(post.id) ||
                                            expandedReviews.has(post.id)) && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    toggleReview(post.id)
                                                }}
                                                className="
                                                    mt-2
                                                    text-[#99FF33]
                                                    text-sm
                                                    font-medium
                                                    hover:underline
                                                    cursor-pointer
                                                "
                                            >
                                                {expandedReviews.has(post.id)
                                                    ? 'Tampilkan lebih sedikit'
                                                    : 'Selengkapnya'}
                                            </button>
                                        )}
                                    </div>
                                    
                                    {post.post_images && post.post_images.map((imgData) => (
                                        <img 
                                            key={imgData.id}
                                            src={`/storage/${imgData.image}`} 
                                            alt="Post Content" 
                                            className="w-full max-w-50 h-auto rounded-xl" 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2.75">
                                <div className="flex gap-1 items-center bg-transparent text-[#adaaaa]">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleLike(post.id, post.is_liked)
                                        }}
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
                                            ${post.is_liked ?
                                                'text-[#99FF33] bg-[#99FF33]/10 shadow-[0_0_15px_rgba(153,255,51,0.15)]'
                                            : 'text-[#adaaaa]'}
                                        `}
                                    >
                                        <ThumbsUp
                                            className={`
                                                w-4 h-4
                                                transition-all duration-300
                                                group-hover:-translate-y-0.5
                                                group-hover:scale-125
                                                ${ post.is_liked ?
                                                    "fill-[#99FF33] scale-110"
                                                : ""}
                                            `}
                                        />
                                        <span className="transition-all duration-300 group-hover:translate-x-0.5">
                                            {post.post_likes.length}
                                        </span>
                                    </button>
                                    <button
                                        className="
                                                group
                                                flex items-center gap-2
                                                px-3 py-2
                                                rounded-xl
                                                text-sm font-medium
                                                text-[#adaaaa]
                                                hover:bg-white/5
                                                hover:text-white
                                                active:scale-95
                                                transition-all duration-300
                                                cursor-pointer
                                        "
                                    >
                                        <MessageCircleMore className="w-4 h-4"/>
                                        {post.comments?.length}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center w-full py-12">
                    <MessageCircleX className='h-32 w-32 text-center text-[#99FF33] mb-8' />
                    <p className="text-center text-white/80 text-sm md:text-base">
                        Anda belum memposting apapun. Ayo buat postingan pertama Anda!.
                    </p>
                </div>
            )}

            {/* delete dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                title="Hapus Postingan"
                description="Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan."
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPostId(null);
                }}
                onConfirm={handleDeletePost}
            />
        </UnusedNavLayout>
    )
}