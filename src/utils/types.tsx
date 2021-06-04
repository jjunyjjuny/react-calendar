export type DateType = {
  year: number;
  month: number;
  day: number;
};

export type Calendar = {
  year: number;
  month: number;
  day: number;
  firstDay: number;
};

export type _OnClickResult = {
  clickedType: ClickTargetType;
  nextClickTarget: ClickTargetType;
  startDate:
    | (DateType & {
        week: string;
      })
    | null;
  endDate:
    | (DateType & {
        week: string;
      })
    | null;
};

export type Direction = 1 | -1;
export type ClickTargetType = "start" | "end";
export type OnClickDay = {
  onClickDay?: (result: _OnClickResult) => void;
};
