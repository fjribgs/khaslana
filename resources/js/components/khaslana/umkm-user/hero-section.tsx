import HeroImage from '@/assets/images/umkm-user/hero-image.png';

export default function HeroSection() {
    return (
        <div className='relative w-full overflow-hidden rounded-4xl mb-12'>
            <img
                src={HeroImage}
                alt="Hero Image"
                className='w-full object-cover min-h-[200px] lg:min-h-[340px] max-h-[340px]'
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-14">
                <p className="text-[#99FF33] text-[11px] lg:text-base font-semibold tracking-[0.25em] uppercase mb-2">
                    UMKM Unggulan Nasional
                </p>
                <h1 className="text-white text-2xl lg:text-6xl font-bold leading-tight max-w-[620px]">
                    Dukung Produk
                    <br />
                    <span className="text-[#99FF33]">
                        Lokal Terbaik.
                    </span>
                </h1>
                <p className="text-[#D1D1D1] text-xs lg:text-lg mt-3 max-w-[300px] md:max-w-[520px] leading-relaxed">
                    Temukan ribuan pelaku usaha kreatif dari seluruh
                    penjuru Nusantara dalam satu direktori terintegrasi.
                </p>
            </div>
        </div>
    )
}