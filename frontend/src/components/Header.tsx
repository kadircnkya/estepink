import { useState, useCallback, useEffect } from 'react';
import { ASSETS, LOGO_SIZE } from '../assets';
import { LINKS, UI, NAV } from '../content/copy';
import { CONTACT } from '../content/site';
import type { NavTarget } from '../lib/config';
import { nightProgress } from '../lib/night';

interface HeaderProps {
  onNavigate?: (target: NavTarget) => void;
}

// Hero geçildikten sonra header koyu temaya geçişi
function useNightHeader(): boolean {
  const [night, setNight] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setNight(nightProgress() > 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return night;
}

export function Header({ onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const night = useNightHeader();

  // Menü açıkken sayfa kaydırmasını kilitle
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('menu-open', menuOpen);
    if (!menuOpen || !window.matchMedia('(max-width: 767.98px)').matches) return;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      root.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleNavClick = (target: NavTarget) => {
    closeMenu();
    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sabit üst vignette: hero fotoğraf renginden bağımsız okunabilirlik */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[9] transition-opacity duration-500"
        style={{
          height: '160px',
          opacity: night ? 0 : 1,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
        }}
      />

      {/* Buzlu cam efekti */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[10] h-[72px] transition-[background,border-color] duration-500"
        style={{
          background: night
            ? 'rgba(28,12,22,0.80)'
            : 'transparent',
          borderBottom: `1px solid ${
            night ? 'rgba(247,232,238,0.10)' : 'transparent'
          }`,
          WebkitBackdropFilter: night ? 'blur(20px) saturate(1.4)' : 'none',
          backdropFilter: night ? 'blur(20px) saturate(1.4)' : 'none',
        }}
      />

      <header
        id="site-header"
        className={[
          'fixed left-0 right-0 top-0 z-[11] flex h-[72px] items-center justify-between px-5 md:px-8',
          night ? 'theme-night' : '',
        ].join(' ')}
      >
        {/* Logo */}
        <a
          href="#"
          aria-label={UI.homeLabel}
          onClick={handleLogoClick}
          className="z-[2] transition-opacity hover:opacity-80"
        >
          <img
            src={ASSETS.logo}
            alt={UI.homeLabel}
            width={LOGO_SIZE.width / 4}
            height={LOGO_SIZE.height / 4}
            className="h-10 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
            draggable={false}
          />
        </a>

        {/* Masaüstü menü */}
        <nav aria-label={UI.navLabel} className="hidden items-center gap-1.5 lg:flex">
          {NAV.map(({ target, label }) => (
            <button
              key={target}
              onClick={() => handleNavClick(target)}
              className={[
                'cursor-pointer rounded-full px-5 py-2',
                'font-sans text-[14px] font-semibold tracking-wide',
                'transition-all duration-200 active:scale-95',
                night
                  ? 'border border-white/30 bg-white/[0.10] text-white hover:border-white/60 hover:bg-white/[0.22] hover:text-white'
                  : 'border border-white/50 bg-white/[0.18] text-white backdrop-blur-md hover:border-white hover:bg-white/[0.30] hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          ))}

          <div className="ml-3">
            <a
              id="header-book-btn"
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'inline-block rounded-full bg-pink-fill px-5 py-2.5',
                'font-sans text-sm font-semibold text-white no-underline',
                'shadow-[0_2px_10px_rgba(216,27,96,0.35)]',
                'transition-all duration-200 hover:bg-[#c2185b] hover:shadow-[0_4px_16px_rgba(216,27,96,0.45)] active:scale-95',
              ].join(' ')}
            >
              {UI.bookShort}
            </a>
          </div>
        </nav>

        {/* Mobil menü butonu */}
        <button
          id="menu-toggle"
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
          className={[
            'z-[2] flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px]',
            'rounded-full border-0 backdrop-blur-md lg:hidden',
            night
              ? 'bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
              : 'bg-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]',
          ].join(' ')}
        >
          <span
            aria-hidden="true"
            className={[
              'block h-[2px] w-[18px] rounded-full transition-all duration-200',
              night || menuOpen ? 'bg-white' : 'bg-ink',
              menuOpen ? 'translate-y-[7px] rotate-45' : '',
            ].join(' ')}
          />
          <span
            aria-hidden="true"
            className={[
              'block h-[2px] w-[18px] rounded-full transition-all duration-200',
              night || menuOpen ? 'bg-white' : 'bg-ink',
              menuOpen ? 'opacity-0' : '',
            ].join(' ')}
          />
          <span
            aria-hidden="true"
            className={[
              'block h-[2px] w-[18px] rounded-full transition-all duration-200',
              night || menuOpen ? 'bg-white' : 'bg-ink',
              menuOpen ? '-translate-y-[7px] -rotate-45' : '',
            ].join(' ')}
          />
        </button>

        {/* Mobil tam ekran menü */}
        <div
          id="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={UI.navLabel}
          aria-hidden={!menuOpen}
          inert={menuOpen ? undefined : ''}
          className={[
            'fixed inset-0 z-[1] flex flex-col bg-[#1c0c16]/[0.97] px-7 pt-[92px] md:hidden',
            'pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        >
          <nav aria-label={UI.navLabel} className="flex flex-1 flex-col justify-center gap-0.5">
            {NAV.map(({ target, label }, i) => (
              <button
                key={target}
                onClick={() => handleNavClick(target)}
                style={{ transitionDelay: menuOpen ? `${90 + i * 45}ms` : '0ms' }}
                className={[
                  'min-h-[52px] cursor-pointer border-0 bg-transparent py-1 text-left font-serif text-[32px] leading-tight text-white',
                  'transition-all duration-500 active:text-pink',
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('iletisim')}
              className="btn-primary w-full cursor-pointer border-0"
            >
              {UI.bookShort}
            </button>
            <div className="flex justify-between px-1 text-[14px] text-white/70">
              <a href={`tel:${CONTACT.phoneHref}`} className="py-2 text-white/80 no-underline">
                {CONTACT.phoneDisplay}
              </a>
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="py-2 text-white/80 no-underline">
                {LINKS.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Tablet menüsü */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-label={UI.navLabel}
          className={[
            'fixed inset-x-4 top-[76px] z-[12] flex flex-col gap-1 rounded-[22px] p-4 max-md:hidden lg:hidden',
            'backdrop-blur-2xl transition-all duration-200',
            night
              ? 'bg-[#1c0c16]/95 shadow-[0_12px_36px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.08)]'
              : 'bg-white/90 shadow-[0_12px_36px_rgba(43,16,32,0.16),inset_0_0_0_1px_rgba(255,255,255,0.7)]',
            menuOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0',
          ].join(' ')}
        >
          {NAV.map(({ target, label }) => (
            <button
              key={target}
              onClick={() => handleNavClick(target)}
              className="cursor-pointer rounded-xl border-0 bg-transparent px-4 py-3 text-left font-sans text-base font-medium text-ink transition-colors hover:bg-pink/10 hover:text-pink"
            >
              {label}
            </button>
          ))}
          <div className="hairline mt-1 border-t pt-2">
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block rounded-full bg-pink-fill px-5 py-3 text-center font-sans text-sm font-semibold text-white no-underline shadow-[0_2px_8px_rgba(216,27,96,0.3)]"
            >
              {UI.bookShort}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
