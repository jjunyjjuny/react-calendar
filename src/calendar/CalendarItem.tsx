import React from "react";
import styled from "styled-components";
import Day from "./Day";
import { DayWrapper } from "../utils/styled";
import { LAST_DAYS, FIRST_DAYS } from "../utils/constant";
import { Calendar, ClickTargetType } from "../utils/types";

export default function CalendarItem({
  year,
  month,
  day,
  firstDay,
  clickTarget,
  lang,
}: Calendar & {
  clickTarget: ClickTargetType;
  lang: string;
}) {
  const empty = FIRST_DAYS[firstDay];
  const days = LAST_DAYS[day];
  return (
    <CalendarItemWrapper>
      <CalendarItemYearMonth>
        {lang === "ko" ? `${year}년 ${month}월` : `${year}.${month}`}
      </CalendarItemYearMonth>
      <CalendarItemDays>
        {empty.map((el) => (
          <DayWrapper typeOfDay="none" />
        ))}
        {days.map((day) => (
          <Day {...{ year, month, day, firstDay, clickTarget }} />
        ))}
      </CalendarItemDays>
    </CalendarItemWrapper>
  );
}

const CalendarItemWrapper = styled.ul``;
const CalendarItemYearMonth = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 3.5rem;
`;

const CalendarItemDays = styled.ul`
  box-sizing: border-box;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
`;
