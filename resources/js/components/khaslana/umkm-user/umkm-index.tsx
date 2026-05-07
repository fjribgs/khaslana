import FilterSection from "@/components/khaslana/umkm-user/filter-section";
import HeroSection from "@/components/khaslana/umkm-user/hero-section";
import UmkmSection from "@/components/khaslana/umkm-user/umkm-section";

export default function UmkmIndex() {
    return (
        <div className="flex flex-col items-center px-6 lg:px-[70px] pt-32 lg:justify-center">
            <HeroSection />
            <FilterSection />
            <UmkmSection />
        </div>
    )
}