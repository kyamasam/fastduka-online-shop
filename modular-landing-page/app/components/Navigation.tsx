'use client';

import { MenuItem } from '@/types/settings';
import * as Icons from 'lucide-react';
import { ChevronDown, Heart, Menu as MenuIcon, Search, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Helper function to convert icon names to PascalCase for Lucide
function getIconComponent(iconName?: string) {
  if (!iconName) return null;

  // Convert snake-case or kebab-case to PascalCase
  const pascalCase = iconName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return (Icons as any)[pascalCase] || null;
}

interface NavigationProps {
  menuItems: MenuItem[];
  logo?: string;
  logoText?: string;
  primaryColor?: string;
  menuBgColor?: string;
  menuTextColor?: string;
}

export default function Navigation({ menuItems, logo, logoText, primaryColor, menuBgColor, menuTextColor }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const sortedMenuItems = [...menuItems].sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleDropdown = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  return (
    <nav style={{ backgroundColor: menuBgColor || '#ffffff', color: menuTextColor || '#000000' }} className="shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" style={{ color: menuTextColor || '#000000' }}>
            {logo ? (
              <img src={logo} alt={logoText || 'Logo'} className="h-8 w-auto" />
            ) : (
              <span className="text-2xl font-bold">
                {logoText || 'FastDuka'}
              </span>
            )}
            {logoText && logo && <span className="text-xl font-medium">{logoText}</span>}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {sortedMenuItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                primaryColor={primaryColor}
                menuTextColor={menuTextColor}
              />
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for Products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="relative p-2 hover:opacity-80 rounded-full">
              <Heart className="w-6 h-6" style={{ color: menuTextColor || '#000000' }} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="relative p-2 hover:opacity-80 rounded-full">
              <ShoppingCart className="w-6 h-6" style={{ color: menuTextColor || '#000000' }} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="p-2 hover:opacity-80 rounded-full">
              <User className="w-6 h-6" style={{ color: menuTextColor || '#000000' }} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:opacity-80 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" style={{ color: menuTextColor || '#000000' }} /> : <MenuIcon className="w-6 h-6" style={{ color: menuTextColor || '#000000' }} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Products..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            {sortedMenuItems.map((item) => (
              <MobileNavigationItem
                key={item.name}
                item={item}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            ))}

            {/* Mobile Icons */}
            <div className="flex items-center gap-4 pt-4 border-t mt-4">
              <button className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                <Heart className="w-5 h-5" />
                <span>Wishlist (0)</span>
              </button>
              <button className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart (0)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavigationItemProps {
  item: MenuItem;
  activeDropdown: string | null;
  toggleDropdown: (name: string) => void;
  primaryColor?: string;
  menuTextColor?: string;
}

function NavigationItem({ item, activeDropdown, toggleDropdown, primaryColor, menuTextColor }: NavigationItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = getIconComponent(item.icon);
  const isActive = activeDropdown === item.name;

  if (!hasChildren) {
    return (
      <Link
        href={item.link}
        target={item.is_external ? '_blank' : undefined}
        rel={item.is_external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 px-3 py-2 hover:opacity-80 font-medium transition-colors"
        style={{ color: isActive ? primaryColor : (menuTextColor || '#000000') }}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {item.name}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={() => toggleDropdown(item.name)}
        onMouseEnter={() => toggleDropdown(item.name)}
        className="flex items-center gap-2 px-3 py-2 hover:opacity-80 font-medium transition-colors"
        style={{ color: isActive ? primaryColor : (menuTextColor || '#000000') }}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {item.name}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`}
        />
      </button>

      {isActive && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          onMouseLeave={() => toggleDropdown(item.name)}
        >
          {item.children?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
            <DropdownItem key={child.name} item={child} level={1} primaryColor={primaryColor} menuTextColor={menuTextColor} />
          ))}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  item: MenuItem;
  level: number;
  primaryColor?: string;
  menuTextColor?: string;
}

function DropdownItem({ item, level, primaryColor, menuTextColor }: DropdownItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = getIconComponent(item.icon);

  if (!hasChildren) {
    return (
      <Link
        href={item.link}
        target={item.is_external ? '_blank' : undefined}
        rel={item.is_external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${level * 1}rem` }}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {item.name}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${level * 1}rem` }}
      >
        <span className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-4 h-4" />}
          {item.name}
        </span>
        <ChevronDown className={`w-4 h-4 -rotate-90 transition-transform ${isOpen ? 'rotate-0' : ''}`} />
      </button>

      {isOpen && (
        <div className="bg-gray-50" onMouseLeave={() => setIsOpen(false)}>
          {item.children?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
            <DropdownItem key={child.name} item={child} level={level + 1} primaryColor={primaryColor} menuTextColor={menuTextColor} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MobileNavigationItemProps {
  item: MenuItem;
  activeDropdown: string | null;
  toggleDropdown: (name: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

function MobileNavigationItem({
  item,
  activeDropdown,
  toggleDropdown,
  setMobileMenuOpen,
}: MobileNavigationItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = getIconComponent(item.icon);
  const isActive = activeDropdown === item.name;

  if (!hasChildren) {
    return (
      <Link
        href={item.link}
        target={item.is_external ? '_blank' : undefined}
        rel={item.is_external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
        onClick={() => setMobileMenuOpen(false)}
      >
        {IconComponent && <IconComponent className="w-5 h-5" />}
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => toggleDropdown(item.name)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
      >
        <span className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-5 h-5" />}
          {item.name}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </button>

      {isActive && (
        <div className="pl-6 py-2">
          {item.children?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
            <MobileDropdownItem
              key={child.name}
              item={child}
              level={1}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MobileDropdownItemProps {
  item: MenuItem;
  level: number;
  setMobileMenuOpen: (open: boolean) => void;
}

function MobileDropdownItem({ item, level, setMobileMenuOpen }: MobileDropdownItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = getIconComponent(item.icon);

  if (!hasChildren) {
    return (
      <Link
        href={item.link}
        target={item.is_external ? '_blank' : undefined}
        rel={item.is_external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={() => setMobileMenuOpen(false)}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
        style={{ paddingLeft: `${level * 1}rem` }}
      >
        <span className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-4 h-4" />}
          {item.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="py-1">
          {item.children?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
            <MobileDropdownItem
              key={child.name}
              item={child}
              level={level + 1}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
