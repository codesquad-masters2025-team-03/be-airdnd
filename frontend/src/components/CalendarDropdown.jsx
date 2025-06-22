import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #000000;
    --rdp-background-color: #f0f0f0;
    --rdp-accent-color-dark: #303030;
    --rdp-background-color-dark: #181a1b;
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 3px solid var(--rdp-accent-color);
    --rdp-border-radius: 50%;
    margin: 1em;
  }

  .rdp-month {
    width: 300px;
  }
  
  .rdp-months {
    display: flex;
    gap: 24px;
  }
  
  .rdp-caption_label {
    font-size: 14px;
    font-weight: bold;
  }
  
  .rdp-nav_button {
    width: 30px;
    height: 30px;
  }

  .rdp-day_today {
    font-weight: bold;
    color: #ff385c;
  }

  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: #222;
    color: white;
  }

  .rdp-day_range_start, .rdp-day_range_end {
    background-color: #222 !important;
    color: white !important;
  }
  
  .rdp-day_range_middle {
    background-color: #f7f7f7;
    border-radius: 0;
  }
`;

function formatCaption(date, options) {
    return format(date, 'yyyy년 LLLL', { locale: options?.locale });
}

const CalendarDropdown = ({ dates, setDates }) => {
    const [month, setMonth] = useState(dates.startDate || new Date());

    const handleDateSelect = (range) => {
        let { from: newStart, to: newEnd } = range || {};

        if(newStart && !newEnd) {
          newEnd = newStart;
        }

        if (newStart && newEnd) {
            if (newStart.getTime() === newEnd.getTime()) {
                newEnd = new Date(newEnd.setDate(newEnd.getDate() + 1));
            }
            if (newStart > newEnd) {
                [newStart, newEnd] = [newEnd, newStart];
            }
        }
        setDates({ startDate: newStart, endDate: newEnd });
    }

    return (
        <CalendarWrapper>
            <DayPicker
                mode="range"
                selected={dates.startDate && dates.endDate ? { from: dates.startDate, to: dates.endDate } : undefined}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                month={month}
                onMonthChange={setMonth}
                locale={ko}
                formatters={{ formatCaption }}
                disabled={{ before: new Date() }}
                showOutsideDays
            />
        </CalendarWrapper>
    );
};

export default CalendarDropdown; 