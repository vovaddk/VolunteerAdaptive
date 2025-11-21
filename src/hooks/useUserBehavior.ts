import { useState, useEffect, useRef } from 'react';

export type BehaviorPattern = {
  chaoticScrolling: boolean;
  longBrowsing: boolean;
  clickDifficulty: boolean;
  scrollCount: number;
  timeOnPage: number;
  missedClicks: number;
  uiScaleFactor: number; // Multiplier for UI scaling (1.0 = normal, 1.15 = +15%, etc)
};

// Helper function to check if element is a button or link
const isClickableElement = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'button' || tagName === 'a') return true;
  
  // Check if element has role="button" or is inside a button/link
  if (element.getAttribute('role') === 'button') return true;
  
  let parent = element.parentElement;
  let depth = 0;
  while (parent && depth < 3) {
    const parentTag = parent.tagName.toLowerCase();
    if (parentTag === 'button' || parentTag === 'a') return true;
    if (parent.getAttribute('role') === 'button') return true;
    parent = parent.parentElement;
    depth++;
  }
  
  return false;
};

// Helper to find nearest clickable element within radius
const findNearestClickable = (x: number, y: number, radius: number): HTMLElement | null => {
  const elements = document.elementsFromPoint(x, y);
  
  // Check if we directly clicked on a clickable
  for (const el of elements) {
    if (isClickableElement(el as HTMLElement)) {
      return el as HTMLElement;
    }
  }
  
  // Check in a radius around the click point
  const allButtons = document.querySelectorAll('button, a, [role="button"]');
  let nearest: { element: HTMLElement; distance: number } | null = null;
  
  for (const button of Array.from(allButtons)) {
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from click to button center
    const distance = Math.sqrt(
      Math.pow(x - buttonCenterX, 2) + Math.pow(y - buttonCenterY, 2)
    );
    
    // Check if click was near the button edges
    const nearEdgeX = x >= rect.left - radius && x <= rect.right + radius;
    const nearEdgeY = y >= rect.top - radius && y <= rect.bottom + radius;
    
    if (nearEdgeX && nearEdgeY && distance <= radius + Math.max(rect.width, rect.height) / 2) {
      if (!nearest || distance < nearest.distance) {
        nearest = { element: button as HTMLElement, distance };
      }
    }
  }
  
  return nearest ? nearest.element : null;
};

export const useUserBehavior = () => {
  const [behavior, setBehavior] = useState<BehaviorPattern>({
    chaoticScrolling: false,
    longBrowsing: false,
    clickDifficulty: false,
    scrollCount: 0,
    timeOnPage: 0,
    missedClicks: 0,
    uiScaleFactor: 1.0,
  });

  const scrollDirectionChanges = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollDirection = useRef<'up' | 'down'>('down');
  const pageLoadTime = useRef(Date.now());
  const scrollEvents = useRef<number[]>([]);
  
  // Click tracking
  const clickAttempts = useRef(0);
  const successfulClicks = useRef(0);
  const nearMisses = useRef<Array<{ x: number; y: number; time: number; nearestButton: HTMLElement | null }>>([]);
  const consecutiveMisses = useRef(0);

  useEffect(() => {
    // Відстеження скролу
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      // Підрахунок зміни напрямку скролу
      if (currentDirection !== lastScrollDirection.current && Math.abs(currentScrollY - lastScrollY.current) > 50) {
        scrollDirectionChanges.current++;
        lastScrollDirection.current = currentDirection;
      }
      
      lastScrollY.current = currentScrollY;
      
      // Записуємо час події скролу
      scrollEvents.current.push(Date.now());
      
      // Залишаємо тільки останні 20 подій
      if (scrollEvents.current.length > 20) {
        scrollEvents.current.shift();
      }
      
      // Визначаємо хаотичність скролу
      // Якщо більше 10 змін напрямку за короткий час
      if (scrollDirectionChanges.current > 10 && scrollEvents.current.length > 15) {
        const timeSpan = scrollEvents.current[scrollEvents.current.length - 1] - scrollEvents.current[0];
        if (timeSpan < 10000) { // За 10 секунд
          setBehavior(prev => ({ 
            ...prev, 
            chaoticScrolling: true,
            scrollCount: scrollDirectionChanges.current 
          }));
        }
      }
    };

    // Відстеження часу на сторінці
    const timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - pageLoadTime.current) / 1000);
      setBehavior(prev => ({ ...prev, timeOnPage: timeSpent }));
      
      // Довге перегляд - більше 2 хвилин на сторінці зі скролом
      if (timeSpent > 120 && scrollEvents.current.length > 10) {
        setBehavior(prev => ({ ...prev, longBrowsing: true }));
      }
    }, 1000);

    // Відстеження кліків з визначенням промахів біля кнопок
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      clickAttempts.current++;
      
      // Check if we clicked on a clickable element
      const isClickable = isClickableElement(target);
      
      if (isClickable) {
        successfulClicks.current++;
        consecutiveMisses.current = 0; // Reset consecutive misses
      } else {
        // Check if we clicked near a button (within 30px radius)
        const nearestButton = findNearestClickable(clickX, clickY, 30);
        
        if (nearestButton) {
          // We missed a button that was nearby!
          nearMisses.current.push({
            x: clickX,
            y: clickY,
            time: Date.now(),
            nearestButton,
          });
          
          consecutiveMisses.current++;
          
          // Keep only last 10 near misses
          if (nearMisses.current.length > 10) {
            nearMisses.current.shift();
          }
          
          // Check if we should increase UI scale
          // Increase by 15% every 3 near-misses
          if (consecutiveMisses.current >= 3) {
            const newScaleFactor = Math.min(behavior.uiScaleFactor + 0.15, 1.75); // Max 175%
            
            setBehavior(prev => ({
              ...prev,
              clickDifficulty: true,
              missedClicks: nearMisses.current.length,
              uiScaleFactor: newScaleFactor,
            }));
            
            consecutiveMisses.current = 0; // Reset after scaling
            
            // Log for debugging
            console.log(`🔍 UI Scale increased to ${(newScaleFactor * 100).toFixed(0)}% after detecting click difficulty`);
          }
        }
      }
      
      // General click difficulty detection (fallback)
      if (clickAttempts.current > 5) {
        const successRate = successfulClicks.current / clickAttempts.current;
        if (successRate < 0.7 && nearMisses.current.length >= 2) {
          setBehavior(prev => ({ 
            ...prev, 
            clickDifficulty: true,
            missedClicks: nearMisses.current.length,
          }));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      clearInterval(timeInterval);
    };
  }, [behavior.uiScaleFactor]);

  const resetBehavior = () => {
    scrollDirectionChanges.current = 0;
    scrollEvents.current = [];
    clickAttempts.current = 0;
    successfulClicks.current = 0;
    nearMisses.current = [];
    consecutiveMisses.current = 0;
    pageLoadTime.current = Date.now();
    setBehavior({
      chaoticScrolling: false,
      longBrowsing: false,
      clickDifficulty: false,
      scrollCount: 0,
      timeOnPage: 0,
      missedClicks: 0,
      uiScaleFactor: 1.0,
    });
  };

  return { behavior, resetBehavior };
};
