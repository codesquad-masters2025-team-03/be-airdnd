import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;

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
    width: 350px;
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
    color: #222;
    border-radius: 0;
  }
`;

function formatCaption(date, options) {
    return format(date, 'yyyy년 LLLL', { locale: options?.locale });
}

const CalendarDropdown = ({ dates, setDates }) => {
    const [month, setMonth] = useState(dates.startDate || new Date());

    const handleDayClick = (day, { disabled }) => {
        if (disabled) {
            return;
        }

        const { startDate, endDate } = dates;

        if (startDate && isSameDay(day, startDate) && !endDate) {
            setDates({ startDate: null, endDate: null });
            return;
        }

        if (startDate && endDate) {
            setDates({ startDate: day, endDate: null });
            return;
        }
        
        if (!startDate) {
            setDates({ startDate: day, endDate: null });
        } else {
            if (day < startDate) {
                setDates({ startDate: day, endDate: null });
            } else {
                setDates({ startDate, endDate: day });
            }
        }
    };

    return (
        <CalendarWrapper>
            <DayPicker
                mode="range"
                selected={dates}
                onDayClick={handleDayClick}
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