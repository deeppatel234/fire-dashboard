import { useCallback, useEffect, useRef, useState } from "react";

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

export const useControlled = (controlledValue, defaultValue) => {
  const controlledRef = useRef(false);
  controlledRef.current = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  // If it is controlled, this directly returns the attribute value.
  const value = controlledRef.current ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (nextValue) => {
      // Only update the value in state when it is not under control.
      if (!controlledRef.current) {
        setUncontrolledValue(nextValue);
      }
    },
    [controlledRef],
  );

  return [value, setValue, controlledRef.current];
};
