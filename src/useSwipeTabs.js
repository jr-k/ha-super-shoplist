import { useEffect } from "react";

const useSwipeTabs = (currentTab, setTab, tabList) => {
    useEffect(() => {
        let startX;
        const onTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const onTouchMove = (e) => {
            const endX = e.touches[0].clientX;
            const deltaX = startX - endX;

            if (Math.abs(deltaX) > 50) {
                const currentIndex = tabList.indexOf(currentTab);
                if (deltaX > 0 && currentIndex < tabList.length - 1) {
                    setTab(tabList[currentIndex + 1]);
                } else if (deltaX < 0 && currentIndex > 0) {
                    setTab(tabList[currentIndex - 1]);
                }
            }
        };

        document.addEventListener("touchstart", onTouchStart);
        document.addEventListener("touchmove", onTouchMove);

        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
        };
    }, [currentTab, setTab, tabList]);
};

export default useSwipeTabs;
