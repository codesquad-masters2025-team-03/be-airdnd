import React, { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay, parseISO, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;

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
    flex-direction: row;
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

const CalendarDropdown = ({ dates, setDates, unavailableDates = [] }) => {
    const [month, setMonth] = useState(dates.startDate || new Date());

    // 예약 불가능한 날짜들을 Date 객체로 변환하고 기간별로 처리
    const disabledDates = useMemo(() => {
        const disabled = [];
        
        // unavailableDates가 배열인지 확인
        if (Array.isArray(unavailableDates)) {
            unavailableDates.forEach(({ checkIn, checkOut }) => {
                const start = parseISO(checkIn);
                const end = parseISO(checkOut);
                
                // checkIn부터 checkOut-1일까지 추가 (체크아웃 당일은 체크인 가능)
                let current = start;
                while (current < end) {
                    disabled.push(new Date(current));
                    current = addDays(current, 1);
                }
            });
        }
        
        return disabled;
    }, [unavailableDates]);

    const handleDayClick = (day, { disabled }) => {
        if (disabled) {
            return;
        }

        const { startDate, endDate } = dates;

        // 선택한 날짜가 예약 불가능한 기간과 겹치는지 확인
        const hasUnavailableInRange = (start, end) => {
            if (!Array.isArray(unavailableDates)) return false;
            
            return unavailableDates.some(({ checkIn, checkOut }) => {
                const unavailableStart = parseISO(checkIn);
                const unavailableEnd = parseISO(checkOut);
                
                return (
                    (start <= unavailableStart && end > unavailableStart) ||
                    (start < unavailableEnd && end >= unavailableEnd) ||
                    (start >= unavailableStart && end <= unavailableEnd)
                );
            });
        };

        // 같은 날짜를 다시 클릭한 경우 선택 해제
        if (startDate && isSameDay(day, startDate) && !endDate) {
            setDates({ startDate: null, endDate: null });
            return;
        }

        // 이미 두 날짜가 선택된 경우 새로운 선택 시작
        if (startDate && endDate) {
            setDates({ startDate: day, endDate: null });
            return;
        }
        
        // 첫 번째 날짜 선택
        if (!startDate) {
            setDates({ startDate: day, endDate: null });
        } else {
            let newCheckIn = startDate;
            let newCheckOut = day;
            
            // 체크아웃이 체크인보다 앞선 경우 자동 교체
            if (day < startDate) {
                newCheckIn = day;
                newCheckOut = startDate;
            }
            
            // 같은 날 선택 시 체크아웃을 다음날로 설정
            if (isSameDay(newCheckIn, newCheckOut)) {
                newCheckOut = addDays(newCheckIn, 1);
            }
            
            // 선택한 기간이 예약 불가능한 날짜와 겹치는지 확인
            if (hasUnavailableInRange(newCheckIn, newCheckOut)) {
                alert('선택한 기간에 예약 불가능한 날짜가 포함되어 있습니다.');
                return;
            }
            
            setDates({ startDate: newCheckIn, endDate: newCheckOut });
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
                disabled={[
                    { before: new Date() },
                    ...disabledDates
                ]}
                showOutsideDays
            />
        </CalendarWrapper>
    );
};

export default CalendarDropdown;
