import { Head } from '@inertiajs/react';
import Footer from '@/components/khaslana/footer';
import Navbar from '@/components/khaslana/navbar';
// import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    // const { auth } = usePage().props;

    return (
        <>
            <Navbar />
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center p-6 lg:justify-center lg:p-8">
                {/* <section className="hero-section">
                    <div className="hero-left">
                        <div className="tag">
                            <h3>Marketplace UMKM Indonesia</h3>
                        </div>   
                        <h1>
                            Bangga Produk Lokal Berkembang Bersama <i>Khaslana.</i>
                        </h1>
                        <p>
                            Temukan ribuan produk karya anak bangsa dari seluruh penjuru negeri. Khaslana hadir untuk menghubungkan kamu dengan keunikan Nusantara, sekaligus mendukung pertumbuhan UMKM Indonesia.
                        </p>
                        <div className="separator"></div>
                        <div className="hero-btn">
                            <a href="#" className="btn-primary">Gabung Sekarang</a>
                            <a href="#" className="btn-secondary">Tentang Kami</a>
                        </div>
                    </div>
                    <div className="hero-right">
                        <img
                            src="./assets/hero-images.png"
                            alt="Gambar Hero Section"
                            className="hero-img"
                        />
                    </div>
                </section> */}
                <p>test test</p>
            </div>
            <Footer />
        </>
    );
}
