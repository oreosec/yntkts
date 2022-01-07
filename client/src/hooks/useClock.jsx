import { useState, useEffect } from "react";

export default function useClock(format24 = false) {
    const [currentClock, setCurrentClock] = useState(
        new Date().toLocaleString()
    );

    const format = {
        hour12: format24,
    };

    useEffect(() => {
        const clock = setInterval(() => {
            setCurrentClock(() => new Date().toLocaleString("id-ID", format));
        }, 1000);

        // cleaning up effect and
        // handling memory leaks and warning from browser console
        return () => clearInterval(clock);
    });

    return currentClock;
}
