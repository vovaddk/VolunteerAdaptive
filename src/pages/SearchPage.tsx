import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { FilterPanel, FilterButton, FilterOptions } from '../components/FilterPanel';
import { OpportunityCard, Opportunity } from '../components/cards/OpportunityCard';
import { Search, MapPin, Sparkles } from 'lucide-react';

const SearchPage: React.FC = () => {
  const { mode, behavioralData } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    locations: [],
    formats: [],
    urgency: false,
    safety: [],
  });

  // Mock data - in real app this would come from API
  const allOpportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Доставка медикаментів на передову',
      organization: 'Український Червоний Хрест',
      category: 'Medical support',
      location: 'frontline',
      format: 'offline',
      urgent: true,
      date: '22 лис, 2025',
      imageUrl: !mode.lowBandwidth ? 'https://images.unsplash.com/photo-1758656993582-ebe464c8011c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' : undefined,
      description: 'Термінова доставка медикаментів та обладнання до польових госпіталів в активних зонах бойових дій.',
      volunteersNeeded: 5,
    },
    {
      id: '2',
      title: 'Онлайн-репетиторство англійської для переміщених дітей',
      organization: 'Освіта Перш За Все',
      category: 'Education',
      location: 'online',
      format: 'online',
      urgent: false,
      date: '23-30 лис, 2025',
      imageUrl: !mode.lowBandwidth ? 'https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' : undefined,
      description: 'Допоможіть переміщеним дітям продовжити навчання через онлайн-заняття.',
      volunteersNeeded: 15,
    },
    {
      id: '3',
      title: 'Відбудова громадського центру на деокупованій території',
      organization: 'Будуємо Разом',
      category: 'Rebuilding',
      location: 'deoccupied',
      format: 'offline',
      urgent: false,
      date: '25 лис - 5 гру, 2025',
      imageUrl: !mode.lowBandwidth ? 'https://images.unsplash.com/photo-1643810771709-e9e23572e271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' : undefined,
      description: 'Приєднуйтесь до команди з відбудови громадського центру, пошкодженого під час окупації.',
      volunteersNeeded: 20,
    },
    {
      id: '4',
      title: 'Роздача гуманітарної допомоги - Київ',
      organization: 'Мережа Волонтерів',
      category: 'Humanitarian aid',
      location: 'rear',
      format: 'offline',
      urgent: false,
      date: 'Щотижня',
      imageUrl: !mode.lowBandwidth ? 'https://images.unsplash.com/photo-1600186755589-84242bd8368f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' : undefined,
      description: 'Регулярна роздача продуктових пакетів та необхідних речей для родин, які потребують.',
      volunteersNeeded: 10,
    },
    {
      id: '5',
      title: 'Гаряча лінія психологічної підтримки',
      organization: 'Ментальне Здоров\'я України',
      category: 'Social support',
      location: 'online',
      format: 'online',
      urgent: true,
      date: 'Постійно',
      description: 'Надавайте емоційну підтримку та кризове втручання людям, постраждалим від війни.',
      volunteersNeeded: 8,
    },
    {
      id: '6',
      title: 'Координатор фронтової логістики',
      organization: 'Мережа підтримки захисту',
      category: 'Help defenders',
      location: 'frontline',
      format: 'offline',
      urgent: true,
      date: 'Негайно',
      description: 'Координуйте постачання військовим підрозділам у зонах активних бойових дій.',
      volunteersNeeded: 3,
    },
    {
      id: '7',
      title: 'IT підтримка для переміщених родин',
      organization: 'Технології заради добра',
      category: 'Online volunteering',
      location: 'online',
      format: 'online',
      urgent: false,
      date: 'Гнучкий графік',
      description: 'Допоможіть переміщеним родинам налаштувати пристрої та отримати доступ до необхідних онлайн-сервісів.',
      volunteersNeeded: 12,
    },
    {
      id: '8',
      title: 'Будівництво укриттів - Львівська область',
      organization: 'Ініціатива Безпечний Притулок',
      category: 'Rebuilding',
      location: 'rear',
      format: 'offline',
      urgent: false,
      date: '1-15 гру, 2025',
      description: 'Допоможіть поб��дувати тимчасові укриття для родин, які втратили свої домівки.',
      volunteersNeeded: 25,
    },
  ];

  // Filter logic
  const filterOpportunities = () => {
    let filtered = allOpportunities;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        opp =>
          opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(opp => filters.categories.includes(opp.category));
    }

    // Locations
    if (filters.locations.length > 0) {
      const locationMap: Record<string, string> = {
        'Frontline': 'frontline',
        'Rear': 'rear',
        'De-occupied': 'deoccupied',
        'Online': 'online',
      };
      const selectedLocations = filters.locations.map(loc => locationMap[loc]);
      filtered = filtered.filter(opp => selectedLocations.includes(opp.location));
    }

    // Formats
    if (filters.formats.length > 0) {
      const formatMap: Record<string, string> = {
        'Online': 'online',
        'Offline': 'offline',
      };
      const selectedFormats = filters.formats.map(fmt => formatMap[fmt]);
      filtered = filtered.filter(opp => selectedFormats.includes(opp.format));
    }

    // Urgency
    if (filters.urgency) {
      filtered = filtered.filter(opp => opp.urgent);
    }

    return filtered;
  };

  const displayOpportunities = filterOpportunities();
  const activeFilterCount = filters.categories.length + filters.locations.length + filters.formats.length + (filters.urgency ? 1 : 0);

  const hasRecommendations = behavioralData.frequentCategories.length > 0 || behavioralData.preferredUrgency;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1>Знайти можливості</h1>
            {hasRecommendations && !mode.frontline && (
              <span className="px-2 py-1 bg-[#0066FF]/10 text-[#0066FF] text-sm rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Персоналізовано
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            {displayOpportunities.length} {displayOpportunities.length === 1 ? 'можливість' : displayOpportunities.length < 5 ? 'можливості' : 'можливостей'} доступно
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Пошук за назвою, організацією чи ключовими словами..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Button (Mobile) */}
        <div className="mb-6 md:hidden">
          <FilterButton onClick={() => setMobileFilterOpen(true)} count={activeFilterCount} />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar (Desktop) */}
          <FilterPanel filters={filters} onFilterChange={setFilters} />

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              isMobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Opportunities Grid */}
          <div className="flex-1">
            {hasRecommendations && displayOpportunities.length > 0 && !mode.frontline && (
              <div className="mb-6 p-4 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-lg">
                <p className="text-sm text-[#0066FF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Показано можливості на основі ваших інтересів та активності
                  </span>
                </p>
              </div>
            )}

            {displayOpportunities.length > 0 ? (
              <div className="grid gap-6">
                {displayOpportunities.map(opportunity => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    variant={mode.compact ? 'compact' : 'normal'}
                    onSelect={id => {
                      window.location.href = `/opportunity/${id}`;
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">Можливостей не знайдено</h3>
                <p className="text-muted-foreground mb-6">
                  Спробуйте налаштувати фільтри чи пошуковий запит
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      categories: [],
                      locations: [],
                      formats: [],
                      urgency: false,
                      safety: [],
                    });
                    setSearchQuery('');
                  }}
                  className="text-[#0066FF] hover:underline"
                >
                  Очистити всі фільтри
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;