import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section"
import PromoSection from "@/components/khaslana/umkm-user/detail-umkm/promo-section"
import UnusedNavLayout from "@/layouts/unused-nav-layout"
import { umkm } from "@/routes"

export default function Index() {
    return (
        <UnusedNavLayout backHref={umkm().url}>
            <HeroSection />
            <PromoSection />
        </UnusedNavLayout>
    )
}