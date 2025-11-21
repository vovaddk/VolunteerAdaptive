import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, Package, Users, Stethoscope, Truck, Home, Shield, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const volunteerOpportunities = [
  {
    id: 'humanitarian',
    title: 'Гуманітарна допомога',
    description: 'Участь у розподілі та доставці гуманітарних вантажів для постраждалих територій',
    icon: Heart,
    urgent: true,
    count: 156,
    areas: ['Розподіл продуктів', 'Пакування посилок', 'Облік вантажів'],
  },
  {
    id: 'logistics',
    title: 'Логістика та транспорт',
    description: 'Організація перевезень, координація маршрутів, управління складами',
    icon: Truck,
    urgent: false,
    count: 89,
    areas: ['Водії', 'Координатори', 'Складська робота'],
  },
  {
    id: 'medical',
    title: 'Медична допомога',
    description: 'Медичний супровід, психологічна підтримка, догляд за пораненими',
    icon: Stethoscope,
    urgent: true,
    count: 67,
    areas: ['Медсестри', 'Парамедики', 'Психологи'],
  },
  {
    id: 'shelter',
    title: 'Підтримка переселенців',
    description: 'Допомога у влаштуванні, пошук житла, адаптація',
    icon: Home,
    urgent: false,
    count: 134,
    areas: ['Координація житла', 'Супровід сімей', 'Адаптація дітей'],
  },
  {
    id: 'cyber',
    title: 'Кібербезпека та IT',
    description: 'Захист інформації, розробка систем, технічна підтримка',
    icon: Shield,
    urgent: false,
    count: 45,
    areas: ['Розробка', 'Безпека', 'Підтримка систем'],
  },
  {
    id: 'coordination',
    title: 'Координація та зв\'язок',
    description: 'Організація волонтерських груп, комунікація між штабами',
    icon: Users,
    urgent: false,
    count: 78,
    areas: ['Оператори', 'Координатори', 'Диспетчери'],
  },
  {
    id: 'communication',
    title: 'Інформаційна підтримка',
    description: 'Ведення соцмереж, створення контенту, інформування населення',
    icon: MessageCircle,
    urgent: false,
    count: 52,
    areas: ['SMM', 'Журналісти', 'Редактори'],
  },
  {
    id: 'packaging',
    title: 'Пакування та сортування',
    description: 'Підготовка посилок, сортування гуманітарки, облік товарів',
    icon: Package,
    urgent: true,
    count: 203,
    areas: ['Пакування', 'Сортування', 'Маркування'],
  },
];

const ForVolunteersPage: React.FC = () => {
  const { mode } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0066FF] to-[#003D99] text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-white mb-4">Долучайтесь до волонтерства</h1>
            <p className="text-xl text-white/90 mb-8">
              Кожен може зробити свій внесок у допомогу Україні. Оберіть напрямок, який вам близький, 
              та станьте частиною великої команди волонтерів.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-[#FFD600] text-[#0066FF] hover:bg-[#FFD600]/90"
              >
                Стати волонтером
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Дізнатись більше
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-t-4 border-t-[#FFD600]">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2 text-[#0066FF]">12,438</div>
              <div className="text-sm text-muted-foreground">Активних волонтерів</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-t-4 border-t-[#0066FF]">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2 text-[#0066FF]">824</div>
              <div className="text-sm text-muted-foreground">Відкритих запитів</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-t-4 border-t-[#FFD600]">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2 text-[#0066FF]">45,892</div>
              <div className="text-sm text-muted-foreground">Виконаних завдань</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-t-4 border-t-[#0066FF]">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2 text-[#0066FF]">98%</div>
              <div className="text-sm text-muted-foreground">Задоволення користувачів</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Opportunities */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="mb-4">Напрямки волонтерської діяльності</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Оберіть напрямок, який відповідає вашим навичкам та можливостям. 
            Кожен внесок важливий для нашої спільної перемоги.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteerOpportunities.map((opportunity) => {
            const Icon = opportunity.icon;
            return (
              <Card 
                key={opportunity.id} 
                className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                  opportunity.urgent 
                    ? 'hover:border-[#FFD600] border-[#FFD600]/30' 
                    : 'hover:border-[#0066FF] border-border'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-lg ${
                      opportunity.urgent 
                        ? 'bg-[#FFD600]/20' 
                        : 'bg-[#0066FF]/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        opportunity.urgent 
                          ? 'text-[#FFD600]' 
                          : 'text-[#0066FF]'
                      }`} />
                    </div>
                    {opportunity.urgent && (
                      <span className="px-2 py-1 bg-[#FFD600] text-[#0066FF] rounded-full text-xs">
                        Терміново
                      </span>
                    )}
                  </div>
                  <CardTitle className="mb-2">{opportunity.title}</CardTitle>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Напрямки роботи:</div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.areas.map((area) => (
                        <span 
                          key={area} 
                          className="px-2 py-1 bg-accent rounded text-xs"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {opportunity.count} відкритих позицій
                    </span>
                    <Button 
                      size="sm" 
                      className={`group-hover:${
                        opportunity.urgent 
                          ? 'bg-[#FFD600] text-[#0066FF]' 
                          : 'bg-[#0066FF]'
                      }`}
                    >
                      Детальніше
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Готові почати?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Зареєструйтесь на платформі та оберіть перше завдання. 
            Наша команда завжди готова допомогти вам на старті.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[#0066FF] hover:bg-[#0066FF]/90"
            >
              Зареєструватися як волонтер
            </Button>
            <Button 
              size="lg"
              variant="outline"
            >
              Зв'язатися з координатором
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForVolunteersPage;
