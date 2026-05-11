import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section"
import UnusedNavLayout from "@/layouts/unused-nav-layout"
import { detail } from "@/routes/umkm"

export default function Index() {
    return (
        <UnusedNavLayout backHref={detail().url}>
            <HeroSection />
        </UnusedNavLayout>
    )
}