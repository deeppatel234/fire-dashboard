import { useCallback, useEffect, useRef } from "react";

type CallBackFunction = (event: Event) => null;

export const useOnClickOutside = (
  handler: CallBackFunction,
): React.Ref<HTMLElement> => {
  const ref = useRef(null);

  const listener = useCallback(
    (event: Event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    },
    [handler],
  );

  useEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, listener]);

  return ref;
};
