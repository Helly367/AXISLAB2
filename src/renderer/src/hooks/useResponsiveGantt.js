import { useState, useEffect } from "react";

export default function useResponsiveGantt(containerRef) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setScale(Math.max(1, width / 1000));
        }
    }, [containerRef]);

    return [scale, setScale];
}