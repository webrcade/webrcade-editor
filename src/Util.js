import { useState, useRef, useEffect } from 'react';

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function asString(str) {
  return str ? str : '';
}

export function useForceUpdate(){
  const [, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}