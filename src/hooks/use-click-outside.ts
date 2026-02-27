import { MutableRefObject, useEffect } from "react";

export const useClickOutside = (
  ref: MutableRefObject<any>,
  onClick: () => void,
) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClick, ref]);
};
