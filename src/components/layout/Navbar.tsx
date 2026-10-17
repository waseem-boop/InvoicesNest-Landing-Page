"use client";
import ActionButton from "@/components/ui/ActionButton";

import BrandLogo from "@/components/ui/BrandLogo";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MobileNavigation, NavigationPanel, Dropdown, MenuButton } from "@/components/ui/Interactive";
import { siteConfig } from "@/data/siteConfig";
import { useNavbarAnimation } from "@/hooks/sections/useNavbarAnimation";

function TrialButton(){return <ActionButton href={siteConfig.navigation.cta.href} className="rt-button w-inline-block" data-motion="navbar-button">{siteConfig.navigation.cta.label}</ActionButton>}

function DropdownLabel({ children }: { children: string }) {
  return <><div className="rt-navbar-font rt-menu">{children}</div><div className="w-layout-hflex rt-navbar-dropdown-icon"><Image src={siteConfig.navigation.dropdownIcon} alt="" className="rt-navbar-dropdown-arrow" width={9} height={6} /></div></>;
}

export default function Navbar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useNavbarAnimation(sectionRef);
  const pathname = usePathname();
  const navigation = siteConfig.navigation;
  return (
    <div className="rt-nav" ref={sectionRef}>
      <MobileNavigation className="rt-navbar w-nav" data-motion="navbar-navbar" data-collapse="medium" role="banner">
        <div className="rt-container rt-space-off w-container"><div className="w-layout-hflex rt-navar-main">
          <Link href="/" className="rt-site-logo w-nav-brand" aria-label={siteConfig.name}><BrandLogo /></Link>
          <NavigationPanel className="rt-nav-menu-wrap w-nav-menu">
            <div className="rt-nav-menu-block"><div className="w-layout-hflex rt-nav-menu">
              <Dropdown className="rt-dropdown w-dropdown" data-motion="navbar-dropdown" label={<DropdownLabel>{navigation.homeLabel}</DropdownLabel>} panelClassName="rt-dropdown-list w-dropdown-list">
                <div className="rt-dropdown-inner rt-dropdown-list-main">
                  {navigation.home.map(link => <Link href={link.href} key={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`rt-dropdown-link rt-navbar-font w-dropdown-link${pathname === link.href ? " w--current" : ""}`}>{link.label}</Link>)}
                </div>
              </Dropdown>
              <Link href={navigation.primary[0].href} className="rt-navbar-font rt-toggle rt-menu" aria-current={pathname === navigation.primary[0].href ? "page" : undefined}>{navigation.primary[0].label}</Link>
              <Dropdown className="rt-dropdown rt-mega-menu-toggle w-dropdown" data-motion="navbar-dropdown-2" label={<DropdownLabel>{navigation.pagesLabel}</DropdownLabel>} panelClassName="rt-dropdown-list rt-navbar-page-menu rt-position-middle w-dropdown-list">
                <div className="rt-mega-menu-inner"><div className="rt-mega-menu-border"><div className="w-layout-vflex rt-mega-menu-wrap rt-overflow-hidden rt-position-relative">
                  <div className="w-layout-hflex rt-mega-menu-inner-top"><div className="w-layout-hflex rt-mega-menu">
                    {[navigation.pages.slice(0, 4), navigation.pages.slice(4)].map((links, index) => (
                      <div className={`rt-page-menu-wrap${index === 0 ? " rt-left" : ""}`} key={index}>
                        {links.map(link => <Link href={link.href} className="rt-dropdown-wrapper w-inline-block" aria-current={pathname === link.href ? "page" : undefined} key={link.href}><div className="rt-dropdown-link rt-navbar-font rt-mega-menu-change">{link.label}</div><div className="rt-dropdown-arrow"><Image src={navigation.arrowIcon} alt="" width={11} height={9} /></div></Link>)}
                      </div>
                    ))}
                  </div></div>
                </div></div></div>
              </Dropdown>
              {navigation.primary.slice(1).map(link => <Link href={link.href} className="rt-navbar-font rt-toggle rt-menu" aria-current={pathname === link.href ? "page" : undefined} key={link.href}>{link.label}</Link>)}
              <div className="er-navbar-mobile-button-wrap rt-full-width"><TrialButton /></div>
              <div className="rt-mobile-menu-paragraph"><p className="rt-gap-off rt-text-color-platinum-grey">Invoices, clients and business essentials. All in one place.</p></div>
              
            </div></div>
          </NavigationPanel>
          <div className="w-layout-hflex rt-nav-right"><div className="rt-tab-display-none"><TrialButton /></div><MenuButton className="rt-menu-button w-nav-button"><div className="rt-menu-line rt-top-line" /><div className="rt-menu-line rt-middle-line" /><div className="rt-menu-line rt-bottom-line" /></MenuButton></div>
          <div className="rt-navbar-overlay" />
        </div></div>
      </MobileNavigation>
    </div>
  );
}
