import { memo } from "react";

import useCalendar from "../../hooks/useCalendar";

import { BiChevronUpCircle, BiChevronDownCircle } from "react-icons/bi";
import ButtonIcon from "../atoms/ButtonIcon";

function Calendar({ date = new Date(), setter }) {
    const {
        // variables
        days,
        months,

        // states
        currentDate,
        selectedDate,
        setCurrentDate,
        setSelectedDate,

        // functions
        renderCalendar,
        handleNextButton,
        handlePrevButton,
    } = useCalendar(date);

    function handleCalendarOnClick(selected) {
        const current = new Date(selected);

        current.setHours(new Date(Date.now()).getHours());
        current.setMinutes(new Date(Date.now()).getMinutes());
        current.setSeconds(new Date(Date.now()).getSeconds());
        current.setMilliseconds(new Date(Date.now()).getMilliseconds());

        setSelectedDate(current);
        setCurrentDate(current);
        setter(current);
    }

    return (
        <div className="calendar">
            <div className="calendar--calendar-label">
                <div className="calendar--calendar-label--label-text">
                    <p className="font-bold">
                        {months[selectedDate.getMonth()]}
                    </p>
                    <p className="text-xs">{selectedDate.getFullYear()}</p>
                </div>
                <div className="calendar--calendar-label--buttons">
                    <ButtonIcon
                        className="calendar--calendar-label--buttons--button"
                        onClick={() => handlePrevButton()}
                    >
                        <BiChevronUpCircle />
                    </ButtonIcon>
                    <ButtonIcon
                        className="calendar--calendar-label--buttons--button"
                        onClick={() => handleNextButton()}
                    >
                        <BiChevronDownCircle />
                    </ButtonIcon>
                </div>
            </div>
            <div className="calendar--calendar-views">
                <div className="calendar--calendar-views--weekdays">
                    {days.map((day, key) => (
                        <div key={key}>{day}</div>
                    ))}
                </div>
                <div className="calendar--calendar-views--dates">
                    {renderCalendar().map(({ date, classess }, key) => (
                        <div
                            className={`calendar--calendar-views--dates--date ${classess} ${
                                date.getFullYear() ===
                                    currentDate.getFullYear() &&
                                date.getMonth() === currentDate.getMonth() &&
                                date.getDate() === currentDate.getDate()
                                    ? "date-now"
                                    : ""
                            }`}
                            key={key}
                            onClick={() => handleCalendarOnClick(date)}
                        >
                            {date.getDate()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(Calendar);
