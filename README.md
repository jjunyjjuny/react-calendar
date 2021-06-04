# 📅 react-calendar

- calendar component in React
- you can use this component in JavaScript or TypeScript

<br/>

## 🔲Sample

<br/>

![click](https://user-images.githubusercontent.com/41738385/120073836-fc189000-c0d4-11eb-9032-469661cfe179.gif)

<br/>

## 🚀 Installation

Using npm :

```
$ npm i @jjunyjjuny/react-calendar
```

<br/>

## Usage with styled-components

<br/>

### with TypeScript

```
import { useState } from "react";
import styled, { css } from "styled-components";
import Calendar, { OnClickResult, Controller } from "./calendar/Calendar";

export default function Sample() {
  const [target, setTarget] = useState("start");

  const onClickDay = (result: OnClickResult) => {
    setTarget(result.nextClickTarget);
  };

  return (
    <TestWrapper>
      <ControllerContainer>
        <Controller start>
          <Button
            isNext={target === "start"}
            onClick={() => {
              setTarget("start");
            }}
          >
            checkIn
          </Button>
        </Controller>
        <Controller end>
          <Button
            isNext={target === "end"}
            onClick={() => {
              setTarget("end");
            }}
          >
            checkOut
          </Button>
        </Controller>
      </ControllerContainer>
      <Calendar onClickDay={onClickDay} countOfMonth={2} />
    </TestWrapper>
  );
}

const TestWrapper = styled.div`
  width: 800px;
  margin: 150px auto;
  padding: 1rem;
  border-radius: 3rem;
  border: 1px solid black;
`;

const ControllerContainer = styled.div`
  width: 30%;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
`;

const Button = styled.div<{ isNext: boolean }>`
  height: 2rem;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isNext }) =>
    isNext &&
    css`
      background: #21618b;
      color: white;
    `};
  & + & {
    margin-left: 2rem;
  }
`;

```

<br/>

## 📃 props

<br/>

### Calendar

|     Name     |   Type   |                        Description                        |
| :----------: | :------: | :-------------------------------------------------------: |
|  onClickDay  | function | Callback function to be executed when the date is clicked |
| countOfMonth |  number  |           Number of months to show at one time            |
|     lang     |  string  |  select calendar language 'en' or 'ko'. defualt is 'en'   |

<br/>

#### About onClcikDay

- This function receives an object called "result".
- The "result" object contains information about the date you clicked on.

```typescript
// example "result"
{
  clickedType: string,
  nextClickTarget: string,
  startDate: {
    year : number,
    month : number,
    day : number
    week: string
  },
  endDate: {
    year : number,
    month : number,
    day : number,
    week: string,
  },
}
```

|        Name        |  Type  |                     Description                      |
| :----------------: | :----: | :--------------------------------------------------: |
|    clickedType     | string |         Date Type you clicked (start or end)         |
|  nextClickTarget   | string |        Next Date Type you click (start, end)         |
| startDate, endDate | object | Date infomation you clicked (year, month, day, week) |

<br/>

- All you need to do is create a function that takes this "result" object and runs it and passes it to the onClickDay function of the Calendar component!
- Check out the Sample

<br/>

### Controller

|    Name    |  Value  |            Description            |
| :--------: | :-----: | :-------------------------------: |
| start, end | boolean | Type of date to click in calendar |

<br/>

#### Wait is Controller?

- Controller is a wrapper that allows you to specify if the date to be clicked is start or end

- you can create checkIn, checkOut button by using this.

- check sample code!
