import { router } from "@inertiajs/react";
import { Image, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import ProfileIcon from "@/assets/icons/default-profile.png";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast } from "@/lib/toast";

export function CreatePost() {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isUploaded, setIsUploaded] = useState(false);

    const PostOptions = [
        {
            id: 1,
            label: "Upload Gambar",
            src: <Image className="w-5 group-hover:-rotate-20 group-hover:scale-110 transition-all duration-300"/>,
            accept: "image/*"
        },
    ]

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            setMediaFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleRemoveFile = () => {
        setMediaFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    }

    const handlePublish = () => {
        if (!content.trim() && !mediaFile) {
            showErrorToast("Postingan tidak boleh kosong");
            return;
        }

        if (!content.trim()) {
            showErrorToast('Postingan harus memiliki teks');
            return;
        }

        router.post("/community", {
            content: content,
            images: mediaFile ? [mediaFile] : [],
        }, {
            forceFormData: true,
            onSuccess: () => {
                setContent("");
                setMediaFile(null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }

                setIsUploaded(true);

                setTimeout(() => {
                    setIsUploaded(false);
                    router.visit("/community", {
                        preserveScroll: false
                    })
                }, 3000);
            }
        });
    }

    return (
        <div className="flex flex-col w-full mx-auto">
            <section className="flex flex-col w-full pb-10 max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">
                    Buat Postingan
                </h2>
            </section>

            {isUploaded &&  (
                <div className="w-full bg-[#99FF33]/20 border border-[#99FF33] text-[#99FF33] p-4 rounded-[15px] text-sm font-medium">Postingan berhasil diupload!</div>
            )}

            <div className="flex flex-col w-full bg-[#222] md:p-8 gap-4 rounded-[15px] mb-20">
                <div className="flex items-start gap-3.75">
                    <img
                        src={user.profile_photo ?? ProfileIcon}
                        alt="Profile"
                        className="w-12 aspect-square border border-white/10 rounded-full max-md:w-8 object-cover"
                    />
                    <Textarea
                        placeholder="Bagikan strategi pertumbuhan Anda hari ini..."
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={1000}
                        autoFocus
                    />
                </div>
                <div className="flex justify-end mb-8">
                    <span
                        className={`
                            text-xs
                            ${content.length >= 1000
                                ? "text-red-400"
                                : "text-white/40"}
                        `}
                    >
                        {content.length}/1000
                    </span>
                </div>

                {previewUrl && (
                    <div className="flex relative w-full">
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="cursor-pointer absolute top-4 left-4 z-10">
                                <div className="bg-red-700 rounded-4xl p-0.5">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                        </button>
                        <img src={previewUrl} alt="Pratinjau Gambar" className="w-100 rounded-2xl object-cover"/>
                    </div>
                )}

                <div className="post-bottom flex justify-between items-center">
                    <div className="post-options flex gap-3.75">
                        {PostOptions.map((item) => (
                            <label
                                key={item.id}
                                className="bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px] md:text-[15px]"
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={item.accept}
                                    onChange={handleFileChange}
                                />
                                <div
                                    className="
                                        group
                                        flex items-center gap-2
                                        px-3 py-2
                                        rounded-xl
                                        text-sm font-medium
                                        cursor-pointer
                                        transition-all duration-300
                                        hover:bg-[#99FF33]/10
                                        active:scale-95
                                    "
                                >
                                    {item.src} {item.label}
                                </div>
                            </label>
                        ))}
                    </div>
                    <button
                        type="submit"
                        onClick={handlePublish}
                        className="bg-[#99FF33] border border-[#99FF33] py-2.5 px-6.25 font-medium cursor-pointer rounded-[20px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200"
                    >
                        Terbitkan
                    </button>
                </div>
            </div>
        </div>
    )
}