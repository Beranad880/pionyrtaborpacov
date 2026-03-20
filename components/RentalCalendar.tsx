'use client';

import { useState, useEffect, type JSX } from 'react';

interface OccupiedPeriod {
  startDate: string;
  endDate: string;
}

interface RentalCalendarProps {
  className?: string;
}

const DAYS_CS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTHS_CS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

export default function RentalCalendar({ className = '' }: RentalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [occupiedPeriods, setOccupiedPeriods] = useState<OccupiedPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/rental-availability');
      const result = await response.json();

      if (result.success) {
        setOccupiedPeriods(result.data.occupiedPeriods);
      } else {
        setError('Nepodařilo se načíst obsazenost');
      }
    } catch {
      setError('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const isDateOccupied = (date: Date): boolean => {
    const dateStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(date);
    return occupiedPeriods.some(period => {
      return dateStr >= period.startDate && dateStr <= period.endDate;
    });
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday = 0
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: JSX.Element[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 md:h-12" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isOccupied = isDateOccupied(date);
      const isPast = isPastDate(date);

      let bgClass = 'bg-white hover:bg-slate-50';
      let textClass = 'text-slate-700';

      if (isPast) {
        bgClass = 'bg-slate-100';
        textClass = 'text-slate-400';
      } else if (isOccupied) {
        bgClass = 'bg-red-500';
        textClass = 'text-white font-medium';
      }

      days.push(
        <div
          key={day}
          className={`h-10 md:h-12 flex items-center justify-center rounded-lg text-sm ${bgClass} ${textClass} transition-colors`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Obsazenost hájenky
      </h2>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Předchozí měsíc"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-slate-700">
          {MONTHS_CS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Následující měsíc"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_CS.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-slate-200 rounded"></div>
            <span className="text-slate-600">Volné</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-600">Obsazeno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 rounded"></div>
            <span className="text-slate-600">Minulé dny</span>
          </div>
        </div>
      </div>
    </div>
  );
}
