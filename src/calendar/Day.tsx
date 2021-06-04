import React, { Dispatch, useEffect } from "react";
import styled from "styled-components";
import {
  useDatesDispatch,
  useCalendarMethod,
  useDatesState,
  useConstantState,
} from "./CalendarProvider";
import { DatesAction } from "./CalendarReducer";
import { DAYS, MESSAGE } from "../utils/constant";
import {
  Calendar,
  ClickTargetType,
  DateType,
  OnClickDay,
} from "../utils/types";
import { DayWrapper } from "../utils/styled";

export default function Day({
  year,
  month,
  day,
  firstDay,
  clickTarget,
}: Calendar & {
  clickTarget: ClickTargetType;
}) {
  const { onClickDay, setClickTarget } = useCalendarMethod();
  const { startDate, endDate, today } = useDatesState();
  const { lang } = useConstantState();
  const thisDate = new Date(year, month - 1, day);
  const isToday = getIsToday(year, month, day, today);
  const done = Boolean(startDate && endDate);
  const dispatch = useDatesDispatch();
  const typeOfDay = getTypeOfDay(startDate, endDate, thisDate, isToday);

  return (
    <DayWrapper typeOfDay={typeOfDay} done={done}>
      <DayCircle
        onClick={() => {
          const caseType = specifyCase({
            thisDate,
            startDate,
            endDate,
            clickTarget,
          });
          const action = actionByCase({
            dispatch,
            startDate,
            endDate,
            thisDate,
            setClickTarget,
          });
          action({
            caseType,
            onClickDay,
            lang,
            firstDay,
            day,
          });
        }}
      >
        {day}
      </DayCircle>
    </DayWrapper>
  );
}

function getTypeOfDay(
  startDate: Date | null,
  endDate: Date | null,
  thisDate: Date,
  isToday: boolean
) {
  if (thisDate < new Date() && !isToday) {
    return "passed";
  }
  if (startDate && thisDate.getTime() === startDate.getTime()) return "start";
  if (endDate && thisDate.getTime() === endDate.getTime()) return "end";
  if (startDate && endDate && thisDate > startDate && thisDate < endDate)
    return "between";
  return "none";
}

type SpecifyCaseProps = {
  thisDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  clickTarget: ClickTargetType;
};

function specifyCase({
  thisDate,
  startDate,
  endDate,
  clickTarget,
}: SpecifyCaseProps) {
  if (!startDate && !endDate) {
    if (clickTarget === "start") {
      return "CASE_SET_START";
    }
    if (clickTarget === "end") {
      return "CASE_SET_END";
    }
  }
  if (startDate && !endDate) {
    if (thisDate < startDate || clickTarget === "start") {
      return "CASE_SET_START";
    }
    return "CASE_SET_END";
  }
  if (!startDate && endDate) {
    if (thisDate > endDate || clickTarget === "end") {
      return "CASE_SET_END";
    }
    return "CASE_SET_START";
  }
  if (startDate && endDate) {
    if (
      thisDate.getTime() === startDate.getTime() ||
      thisDate.getTime() === endDate.getTime()
    ) {
      return "CASE_CLEAR_BOTH";
    }
    if (thisDate < startDate) {
      return "CASE_SET_START_CLEAR_END";
    } else if (thisDate > endDate) {
      if (clickTarget === "start") {
        return "CASE_SET_START_CLEAR_END";
      } else if (clickTarget === "end") {
        return "CASE_SET_END";
      }
    }
    if (clickTarget === "start") {
      return "CASE_SET_START";
    }
    return "CASE_SET_END";
  }
  throw new Error(MESSAGE.ERROR.NOT_FOUND_CASE);
}

type Case =
  | "CASE_SET_START"
  | "CASE_SET_END"
  | "CASE_SET_START_CLEAR_END"
  | "CASE_CLEAR_BOTH";

type ActionByCaseProps = {
  dispatch: Dispatch<DatesAction>;
  startDate: Date | null;
  endDate: Date | null;
  thisDate: Date;
  setClickTarget: (clickTarget: ClickTargetType) => void;
};

const actionByCase =
  ({
    dispatch,
    startDate,
    endDate,
    thisDate,
    setClickTarget,
  }: ActionByCaseProps) =>
  ({
    caseType,
    onClickDay,
    lang,
    firstDay,
    day,
  }: OnClickDay & {
    caseType: Case;
    lang: string;
    firstDay: number;
    day: number;
  }) => {
    switch (caseType) {
      case "CASE_SET_START":
        dispatch({
          type: caseType,
          startDate: thisDate,
          nextClickTarget: "end",
        });
        setClickTarget("end");
        onClickDay?.({
          clickedType: "start",
          nextClickTarget: "end",
          startDate: convertDate(thisDate, lang),
          endDate: convertDate(endDate, lang),
        });
        break;
      case "CASE_SET_END":
        dispatch({
          type: caseType,
          endDate: thisDate,
          nextClickTarget: startDate ? "end" : "start",
        });
        if (!startDate) {
          setClickTarget("start");
          onClickDay?.({
            clickedType: "end",
            nextClickTarget: "start",
            startDate: convertDate(startDate, lang),
            endDate: convertDate(thisDate, lang),
          });
          break;
        }
        setClickTarget("end");
        onClickDay?.({
          clickedType: "end",
          nextClickTarget: "end",
          startDate: convertDate(startDate, lang),
          endDate: convertDate(thisDate, lang),
        });
        break;
      case "CASE_SET_START_CLEAR_END":
        dispatch({
          type: caseType,
          startDate: thisDate,
          nextClickTarget: "end",
        });
        setClickTarget("end");
        onClickDay?.({
          clickedType: "start",
          nextClickTarget: "end",
          startDate: convertDate(thisDate, lang),
          endDate: null,
        });
        break;
      case "CASE_CLEAR_BOTH":
        dispatch({ type: caseType, nextClickTarget: "start" });
        setClickTarget("start");
        onClickDay?.({
          clickedType: "start",
          nextClickTarget: "start",
          startDate: null,
          endDate: null,
        });
        break;
      default:
        throw new Error(MESSAGE.ERROR.INVALID_CASE);
    }
  };

function getWeek(lang: string, firstDay: number, day: number): string {
  const i = (firstDay + day - 1) % 7;
  return DAYS[lang][i];
}
function convertDate(date: Date | null, lang: string) {
  if (!date) return null;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    week: getWeek(lang, date.getDay(), date.getDate()),
  };
}
function getIsToday(year: number, month: number, day: number, today: DateType) {
  if (year !== today.year) return false;
  if (month - 1 !== today.month) return false;
  if (day !== today.day) return false;
  return true;
}
const DayCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;
