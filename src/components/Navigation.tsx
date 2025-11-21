import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext'; // Перевірте правильність шляху
import { Link, useRouter } from '../lib/router'; // ⚠️ ІМПОРТУЄМО useRouter
import {
  Menu,
  X,
  Home,
  Search,
  BookOpen,
  FileText,
  Info,
  User,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    mode,
    toggleDarkMode,
    toggleLowBandwidth,
    toggleFrontlineMode,
    userProfile,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ⚠️ ОТРИМУЄМО ПОТОЧНИЙ ШЛЯХ. Без цього меню не буде оновлюватись!
  const { currentPath } = useRouter();

  const navItems = [
    { path: '/', label: 'Головна', icon: Home },
    { path: '/search', label: 'Можливості', icon: Search },
    { path: '/for-volunteers', label: 'Для волонтерів', icon: User },
    { path: '/for-organizations', label: 'Для організацій', icon: FileText },
    { path: '/learning', label: 'Навчання', icon: BookOpen },
    { path: '/about', label: 'Про нас', icon: Info },
  ];

  // Допоміжний компонент для одного пункту меню
  const NavItemRenderer = ({
    path,
    label,
    icon: Icon,
    isMobile = false,
  }: {
    path: string;
    label: string;
    icon: any;
    isMobile?: boolean;
  }) => {
    // Логіка активного класу:
    // Якщо це головна '/', то повний збіг. Інакше - перевіряємо чи починається шлях
    const isActive =
      path === '/' ? currentPath === '/' : currentPath.startsWith(path);

    // Базові стилі
    const baseStyle = isMobile
      ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors'
      : 'flex items-center gap-1.5 px-2 py-2 transition-colors text-sm rounded-md';

    // Стилі для активного/неактивного стану
    const activeStyle = isMobile
      ? 'bg-[#FFD600]/10 text-black font-medium border-l-4 border-[#FFD600]' // Мобільний активний
      : 'text-[#0066FF] bg-blue-50 font-medium'; // Десктоп активний

    const inactiveStyle = isMobile
      ? 'hover:bg-muted text-muted-foreground'
      : 'text-muted-foreground hover:text-[#0066FF] hover:bg-gray-50';

    return (
      <Link
        to={path}
        onClick={() => setMobileMenuOpen(false)}
        className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
      >
        <Icon
          className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} ${
            isActive ? 'text-[#0066FF]' : ''
          }`}
        />
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-40 bg-background border-b border-border ${
        !mode.lowBandwidth ? 'backdrop-blur-sm bg-background/95' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD600] to-[#0066FF] rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">V+</span>
            </div>
            <span className="hidden sm:block font-semibold">Volunteer+</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItemRenderer key={item.path} {...item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mode Toggles - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title={mode.dark ? 'Світлий режим' : 'Темний режим'}
              >
                {mode.dark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleLowBandwidth}
                className={`p-2 hover:bg-muted rounded-lg transition-colors ${
                  mode.lowBandwidth ? 'text-[#FFD600]' : ''
                }`}
                title="Економія трафіку"
              >
                {mode.lowBandwidth ? (
                  <WifiOff className="w-5 h-5" />
                ) : (
                  <Wifi className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleFrontlineMode}
                className={`p-2 hover:bg-muted rounded-lg transition-colors ${
                  mode.frontline ? 'text-[#FF3B30]' : ''
                }`}
                title="Режим передової"
              >
                <AlertTriangle className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile / Cabinet */}
            <Link
              to={userProfile ? '/cabinet' : '/cabinet'}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FFD600] text-black rounded-lg hover:bg-[#FFED4E] transition-colors font-medium"
            >
              <User className="w-4 h-4" />
              <span>Кабінет</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItemRenderer key={item.path} {...item} isMobile={true} />
            ))}

            <div className="border-t border-border my-4 pt-4">
              <Link
                to="/cabinet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-[#FFD600] text-black rounded-lg hover:bg-[#FFED4E] transition-colors font-medium"
              >
                <User className="w-5 h-5" />
                <span>Мій кабінет</span>
              </Link>
            </div>

            {/* Mobile Toggles */}
            <div className="border-t border-border my-4 pt-4 space-y-2">
              <p className="px-4 py-2 text-sm text-muted-foreground">
                Налаштування
              </p>

              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="flex items-center gap-3">
                  {mode.dark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>Тема</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {mode.dark ? 'Темна' : 'Світла'}
                </span>
              </button>

              <button
                onClick={toggleLowBandwidth}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="flex items-center gap-3">
                  {mode.lowBandwidth ? (
                    <WifiOff className="w-5 h-5" />
                  ) : (
                    <Wifi className="w-5 h-5" />
                  )}
                  <span>Економія даних</span>
                </span>
                <span
                  className={`text-sm ${
                    mode.lowBandwidth
                      ? 'text-[#FFD600]'
                      : 'text-muted-foreground'
                  }`}
                >
                  {mode.lowBandwidth ? 'Увімк' : 'Вимк'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
