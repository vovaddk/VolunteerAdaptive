import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { AdaptiveButton } from './AdaptiveButton';

export type FilterOptions = {
  categories: string[];
  locations: string[];
  formats: string[];
  urgency: boolean;
  safety: string[];
};

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { mode } = useApp();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'categories',
    'locations',
    'formats',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const categoryOptions = [
    'Help defenders',
    'Regular volunteering',
    'Online volunteering',
    'Social support',
    'Humanitarian aid',
    'Rebuilding',
    'Medical support',
    'Education',
  ];

  const locationOptions = ['Frontline', 'Rear', 'De-occupied', 'Online'];
  const formatOptions = ['Online', 'Offline'];
  const safetyOptions = ['Safe zones only', 'Combat zones accepted'];

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    onFilterChange({ ...filters, locations: newLocations });
  };

  const handleFormatToggle = (format: string) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter(f => f !== format)
      : [...filters.formats, format];
    onFilterChange({ ...filters, formats: newFormats });
  };

  const handleSafetyToggle = (safety: string) => {
    const newSafety = filters.safety.includes(safety)
      ? filters.safety.filter(s => s !== safety)
      : [...filters.safety, safety];
    onFilterChange({ ...filters, safety: newSafety });
  };

  const handleClearAll = () => {
    onFilterChange({
      categories: [],
      locations: [],
      formats: [],
      urgency: false,
      safety: [],
    });
  };

  const FilterSection = ({
    title,
    options,
    selected,
    onToggle,
    sectionKey,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (option: string) => void;
    sectionKey: string;
  }) => {
    const isExpanded = expandedSections.includes(sectionKey);

    return (
      <div className="border-b border-border pb-4 mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full mb-3 hover:text-[#0066FF] transition-colors"
        >
          <h4>{title}</h4>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="space-y-2">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-5 h-5 rounded border-2 border-border text-[#FFD600] focus:ring-2 focus:ring-[#FFD600] focus:ring-offset-0"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const filterContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3>Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-[#0066FF] hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <FilterSection
          title="Category"
          options={categoryOptions}
          selected={filters.categories}
          onToggle={handleCategoryToggle}
          sectionKey="categories"
        />

        <FilterSection
          title="Location"
          options={locationOptions}
          selected={filters.locations}
          onToggle={handleLocationToggle}
          sectionKey="locations"
        />

        <FilterSection
          title="Format"
          options={formatOptions}
          selected={filters.formats}
          onToggle={handleFormatToggle}
          sectionKey="formats"
        />

        <FilterSection
          title="Safety"
          options={safetyOptions}
          selected={filters.safety}
          onToggle={handleSafetyToggle}
          sectionKey="safety"
        />

        <div className="pb-4 mb-4">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={filters.urgency}
              onChange={e => onFilterChange({ ...filters, urgency: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-border text-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30] focus:ring-offset-0"
            />
            <span className="flex-1">🔥 Urgent only</span>
          </label>
        </div>
      </div>
    </div>
  );

  // Mobile modal version
  if (isMobileOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
        <div className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3>Filters</h3>
            <button
              onClick={onMobileClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {filterContent}
          </div>

          <div className="p-4 border-t border-border bg-background">
            <AdaptiveButton fullWidth onClick={onMobileClose}>
              Apply Filters
            </AdaptiveButton>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar version
  return (
    <div className="hidden md:block w-80 bg-card border border-border rounded-lg p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden">
      {filterContent}
    </div>
  );
};

export const FilterButton: React.FC<{ onClick: () => void; count: number }> = ({
  onClick,
  count,
}) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-[#FFD600] transition-colors"
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span>Filters</span>
      {count > 0 && (
        <span className="px-2 py-0.5 bg-[#FFD600] text-black text-sm rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};
