import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Meeting, mockQuotes } from '../data/mockData';

interface MeetingsCalendarProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
}

export function MeetingsCalendar({ meetings, onMeetingClick }: MeetingsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(m => m.dateTime.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayMeetings = getMeetingsForDate(day);
    const isToday = day === 9 && currentDate.getMonth() === 9;

    days.push(
      <div
        key={day}
        className={`p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 ${
          isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
        } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
      >
        <div className={`text-sm font-medium mb-1 ${
          isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayMeetings.map(meeting => {
            const quote = mockQuotes.find(q => q.id === meeting.quoteId);
            const time = new Date(meeting.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick?.(meeting)}
                className="text-xs p-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded truncate"
              >
                {time} - {quote?.companyNames[0] || 'Meeting'}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
