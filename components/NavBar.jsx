import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Six, Seven } from "./SVG/index";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  {
    ssr: false,
  }
);

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      title: "Home",
      path: "#home",
      isScrollspy: true,
    },
    {
      title: "About",
      path: "#about",
      isScrollspy: true,
    },
    {
      title: "Roadmap",
      path: "#roadmap",
      isScrollspy: true,
    },
    {
      title: "Features",
      path: "#features",
      isScrollspy: true,
    },
  ];

  const handleScrollspy = (e, id) => {
    e.preventDefault();

    const element = document.getElementById(id.replace("#", ""));

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header-area">
      <div
        className={`xb-header ${
          isSticky ? "sticky" : ""
        } bg-gray-900 border-b border-gray-800`}
        style={{
          backgroundColor: isSticky
            ? "rgba(17,24,39,0.9)"
            : "transparent",
          backdropFilter: isSticky ? "blur(10px)" : "none",
        }}
      >
        <div className="container mx-auto">
          <div className="header_wrap ul_li_between flex items-center justify-between py-4 px-4">
            {/* Logo */}
            <div className="header-logo">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                    style={{ width: "40px", height: "40px" }}
                  />
                  <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-emerald-500">
                    Solaris
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="main-menu_wrap ul_li navbar navbar-expand-lg hidden lg:block">
              <nav className={`main-menu ${isMobileMenuOpen ? "show" : ""}`}>
                <ul className="flex space-x-8">
                  {menuItems.map((item, index) => (
                    <li key={index} className="relative group">
                      {item.isScrollspy ? (
                        <a
                          href={item.path}
                          className="scrollspy-btn text-gray-300 hover:text-white transition-colors duration-300 py-2 px-1 font-medium"
                          onClick={(e) =>
                            handleScrollspy(e, item.path)
                          }
                        >
                          <span>{item.title}</span>

                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                      ) : (
                        <Link
                          href={item.path}
                          className="text-gray-300 hover:text-white transition-colors duration-300 py-2 px-1 font-medium"
                        >
                          <span>{item.title}</span>

                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right Side */}
            <div className="header-btn ul_li flex items-center space-x-4">
              {mounted && (
                <div className="wallet-button-wrapper">
                  <WalletMultiButton className="wallet-button" />

                  <style jsx>{`
                    :global(.wallet-adapter-button) {
                      background: linear-gradient(
                        to right,
                        #7e5bef,
                        #00d1ff
                      ) !important;
                      transition: all 0.3s ease;
                      border-radius: 0.5rem !important;
                    }

                    :global(.wallet-adapter-button:hover) {
                      background: linear-gradient(
                        to right,
                        #00d1ff,
                        #7e5bef
                      ) !important;
                      transform: translateY(-2px);
                      box-shadow: 0 8px 20px
                        rgba(147, 51, 234, 0.2);
                    }

                    :global(.wallet-adapter-button:active) {
                      background: linear-gradient(
                        to right,
                        #7e5bef,
                        #00d1ff
                      ) !important;
                    }
                  `}</style>
                </div>
              )}

              {/* Mobile Toggle */}
              <div className="header-bar-mobile lg:hidden">
                <button
                  className="xb-nav-mobile text-white p-2 focus:outline-none"
                  onClick={() =>
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                  }
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <Seven /> : <Six />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu bg-gray-900 overflow-hidden transition-all duration-500 lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="border-b border-gray-800 pb-2"
                >
                  {item.isScrollspy ? (
                    <a
                      href={item.path}
                      className="scrollspy-btn text-gray-300 hover:text-white transition-colors duration-300 block py-2"
                      onClick={(e) =>
                        handleScrollspy(e, item.path)
                      }
                    >
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      className="text-gray-300 hover:text-purple-500 transition-colors duration-300 block py-2"
                    >
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
