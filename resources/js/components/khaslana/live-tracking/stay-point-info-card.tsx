interface Props {
    statusToko: string;
    statusLokasi: string;
    address: string;
    prevAddress: string;
    hasPrevPosition: boolean;
    showLastPin: boolean;
    onToggleLastPin: () => void;
}

export default function StayPointInfoCard({
    statusToko,
    statusLokasi,
    address,
    prevAddress,
    hasPrevPosition,
    showLastPin,
    onToggleLastPin
}: Props) {
    return (
        <div className="mt-4 bg-[#E0ECD2] dark:bg-[#1E1B26] rounded-2xl p-5 lg:p-6 border border-white/5 shrink-0">
            <div className="flex flex-col gap-3 lg:gap-4">
                <div className="flex items-center text-sm lg:text-base">
                    <span className="dark:text-white w-20 font-medium">
                        Status :
                    </span>
                    <span
                        className={`
                            font-semibold
                            ${statusToko === 'TUTUP'
                                ? 'text-red-500'
                                : 'dark:text-[#99FF33]'
                            }
                        `}
                    >
                        {statusToko === 'BUKA' ? 'Standby' : statusToko.charAt(0) + statusToko.slice(1).toLowerCase()}
                    </span>
                </div>
                
                <div className="flex flex-col text-sm lg:text-base gap-2">
                    <span className="dark:text-white font-medium">
                        {statusLokasi === 'KELILING' ? 'Lokasi Mangkal Sebelumnya :' : 'Lokasi Saat Ini :'}
                    </span>
                    <div className="
                        bg-[#E0ECD2] dark:bg-[#242424]
                        p-3.5 lg:p-4
                        rounded-xl
                        border-2 border-white dark:border-white/5
                        dark:text-[#D1D1D1]
                        min-h-12.5 w-full
                        leading-relaxed shadow
                        "
                    >
                        {statusLokasi === 'KELILING'
                            ? (prevAddress || 'Memuat data sebelumnya...')
                            : address
                        }
                    </div>
                    
                    {hasPrevPosition && (
                        <div className="flex justify-end mt-1">
                            <button 
                                onClick={onToggleLastPin}
                                className="bg-[#99FF33] text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#8ae62e] transition shadow-[0_2px_10px_rgba(153,255,51,0.2)]"
                            >
                                {showLastPin ? 'Tutup Lokasi Sebelumnya' : 'Lihat Lokasi Sebelumnya'}
                            </button>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}