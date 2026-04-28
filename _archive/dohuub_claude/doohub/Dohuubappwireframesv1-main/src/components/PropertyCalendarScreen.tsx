import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PropertyCalendarScreenProps {
  onBack: () => void;
  onContinue: (checkIn: string, checkOut: string, duration: string) => void;
}

export function PropertyCalendarScreen({
  onBack,
  onContinue
}: PropertyCalendarScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  // Sample unavailable dates (in real app, these would come from API)
  const unavailableDates = [
    new Date(2024, 11, 15),
    new Date(2024, 11, 16),
    new Date(2024, 11, 17),
    new Date(2024, 11, 18),
    new Date(2024, 11, 19),
    new Date(2024, 11, 20),
    new Date(2024, 11, 21),
    new Date(2024, 11, 22),
    new Date(2024, 11, 28),
    new Date(2024, 11, 29),
    new Date(2024, 11, 30),
    new Date(2024, 11, 31),
    new Date(2025, 0, 1),
    new Date(2025, 0, 2),
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => isSameDay(unavailableDate, date));
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date) || isDateInPast(date)) return;

    if (!selectingCheckOut) {
      // Selecting check-in
      setCheckInDate(date);
      setCheckOutDate(null);
      setSelectingCheckOut(true);
    } else {
      // Selecting check-out
      if (date <= checkInDate!) {
        // If selected date is before check-in, reset and set as new check-in
        setCheckInDate(date);
        setCheckOutDate(null);
      } else {
        setCheckOutDate(date);
        setSelectingCheckOut(false);
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (): string => {
    if (!checkInDate || !checkOutDate) return '';
    
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 night';
    if (diffDays < 7) return `${diffDays} nights`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      if (days === 0) return weeks === 1 ? '1 week' : `${weeks} weeks`;
      return `${weeks} week${weeks > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
    }
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    if (remainingDays === 0) return months === 1 ? '1 month' : `${months} months`;
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isUnavailable = isDateUnavailable(date);
      const isPast = isDateInPast(date);
      const isCheckIn = isSameDay(checkInDate, date);
      const isCheckOut = isSameDay(checkOutDate, date);
      const isInRange = isDateInRange(date);
      const isToday = isSameDay(today, date);
      const isDisabled = isUnavailable || isPast;

      let dayClasses = 'aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ';
      
      if (isDisabled) {
        dayClasses += 'bg-gray-200 text-gray-400 cursor-not-allowed';
      } else if (isCheckIn || isCheckOut) {
        dayClasses += 'bg-gray-900 text-white';
      } else if (isInRange) {
        dayClasses += 'bg-gray-300 text-gray-900 cursor-pointer hover:bg-gray-400';
      } else {
        dayClasses += 'text-gray-900 cursor-pointer hover:bg-gray-100 border-2 border-transparent';
      }

      if (isToday && !isCheckIn && !isCheckOut && !isDisabled) {
        dayClasses += ' border-2 border-gray-900';
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={dayClasses}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const canContinue = checkInDate && checkOutDate;
  const duration = calculateDuration();

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Select Dates</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Selected Dates Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Check-in</p>
              <p className="text-gray-900">{checkInDate ? formatDate(checkInDate) : 'Select date'}</p>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Check-out</p>
              <p className="text-gray-900">{checkOutDate ? formatDate(checkOutDate) : 'Select date'}</p>
            </div>
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="p-4 bg-gray-900 text-white rounded-xl">
              <p className="text-sm text-gray-300 mb-1">Duration</p>
              <p className="text-xl">{duration}</p>
            </div>
          )}

          {/* Calendar */}
          <div className="border-2 border-gray-200 rounded-xl p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h3 className="text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="aspect-square flex items-center justify-center text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h3 className="text-gray-900 mb-3">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-900 rounded" />
                <span className="text-gray-600">Selected dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <span className="text-gray-600">Date range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded" />
                <span className="text-gray-600">Unavailable dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-900 rounded" />
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-sm">
              {!checkInDate && "Select your check-in date to begin"}
              {checkInDate && !checkOutDate && "Now select your check-out date"}
              {checkInDate && checkOutDate && "Dates selected! Click Continue to proceed"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={() => {
            if (canContinue) {
              const checkInStr = checkInDate!.toISOString().split('T')[0];
              const checkOutStr = checkOutDate!.toISOString().split('T')[0];
              onContinue(checkInStr, checkOutStr, duration);
            }
          }}
          disabled={!canContinue}
          className="w-full py-3 bg-gray-900 text-white rounded-xl disabled:bg-gray-300 disabled:text-gray-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
