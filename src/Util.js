import { useState, useRef, useEffect } from 'react';
import * as WrcCommon from '@webrcade/app-common'

export function cloneObject(obj) {
  return WrcCommon.cloneObject(obj);
}

export function asString(str) {
  return str ? str : '';
}

export function isEmptyString(str) {
  return str.trim().length === 0;
}

export function asBoolean(obj) {
  if (obj === undefined) {
    return false;
  }
  return obj === true;
}

export function removeEmptyItems(arr) {
  const ret = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].trim();
    if (item.length > 0) {
      ret.push(item);
    }
  }
  return ret;
}

export function splitLines(str) {
  return str.split(/\r?\n|\r|\n/g);
}

export function useForceUpdate() {
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