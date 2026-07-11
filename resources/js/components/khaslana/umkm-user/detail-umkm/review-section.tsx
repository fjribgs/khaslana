import { MessageSquareX } from "lucide-react";

import DefaultProfile from "@/assets/icons/default-profile.png";
import type { Umkm } from "@/types/umkm";
import type { Review } from "@/types/review";

interface ReviewSectionProps {
    umkmData: Umkm;
    reviews: Review[];
}

export default function ReviewSection({
    umkmData,
    reviews,
}: ReviewSectionProps) {
    console.log(reviews?.[0].user)
    return (
        <div className="flex flex-col mt-12 mb-20 gap-2">
            <h2 className="text-xl md:text-2xl font-bold">
                Suara Komunitas
            </h2>
            <h3 className="text-muted-foreground text-sm md:text-base">
                Apa kata mereka tentang pengalaman di {umkmData.store_name}
            </h3>
            {reviews.length === 0 ? (
                <div className="w-full mt-8 flex flex-col gap-4 items-center justify-center">
                    <MessageSquareX className='h-32 w-32 text-center text-[#99FF33]' />
                    <p className="text-sm md:text-base text-center text-white/80">
                        Belum ada review tentang toko ini.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 mt-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex flex-col gap-5 bg-[#222] p-8 rounded-3xl"
                        >
                            <div className="flex items-center justify-between gap-5">
                                <div className="flex items-center gap-5">
                                    <img
                                        src={
                                            review.user.profile?.profile_photo
                                                ? `/storage/${review.user.profile?.profile_photo}`
                                                : DefaultProfile
                                        }
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />

                                    <div className="flex flex-col">
                                        <h6 className="text-white font-medium text-lg">
                                            {review.user.name}
                                        </h6>

                                        <p className="text-[#888] text-sm">
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex text-[#99FF33]">
                                    {"★".repeat(review.rating)}
                                </div>
                            </div>

                            <div>
                                <p className="whitespace-pre-wrap break-words text-white">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}