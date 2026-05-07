import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import cartIcon from "@/assets/images/catalog/cart.png";
import notifIcon from "@/assets/images/catalog/notif.svg";
import profilePic from "@/assets/images/catalog/profile.png";
import logo from "@/assets/images/landing-page/khaslana-logo-green.png";

export function LoggedInNavbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const currentPath = url.split('?')[0].replace(/\/$/, '') || "/";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menus = [
        { name: "Beranda", href: "/" },
        { name: "Katalog", href: "/catalog" },
        { name: "UMKM", href: "/umkm" },
        { name: "Komunitas", href: "/community" },
    ];

    return (
        <nav className={`fixed left-1/2 -translate-x-1/2 w-full z-[999] transition-all duration-500 flex items-center justify-between
            ${scrolled 
                ? "top-4 w-[92%] py-3 px-8 bg-[#1E1B26]/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-full scale-[0.95]" 
                : "top-0 w-full py-5 px-6 lg:px-[55px] bg-transparent"}`}>
            
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-11" />
                <span className="text-white font-bold text-lg hidden sm:block">Khaslana</span>
            </Link>

            {/* Mid: Menu Links */}
            <ul className="flex items-center gap-6 lg:gap-8 text-[13px] font-medium">
                {menus.map((menu) => {
                    const isActive = menu.href === "/" ? currentPath === "/" : currentPath.startsWith(menu.href);
                    return (
                        <li key={menu.name}>
                            <Link 
                                href={menu.href} 
                                className={`relative py-1 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#99FF33] after:transition-transform after:duration-300
                                ${isActive 
                                    ? "text-[#99FF33] after:scale-x-100" 
                                    : "text-[#989898] hover:text-[#99FF33] after:scale-x-0 hover:after:scale-x-100"}`}>
                                {menu.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Right: Icons */}
            <div className="flex items-center gap-4 lg:gap-10">
                <img src={notifIcon} alt="notif" className="w-5 cursor-pointer" />
                <img src={cartIcon} alt="cart" className="w-5 cursor-pointer" />
                <img src={profilePic} alt="profile" className="w-10 rounded-full cursor-pointer hidden md:block" />
            </div>
        </nav>
    );
}