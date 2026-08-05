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

// Strips a URL down to its filename, decoded and with any query string
// removed (e.g. ".../foo%20bar.zip?dl=1" -> "foo bar.zip").
export function getFilename(url) {
  try {
    const parts = url.split('/');
    const raw = decodeURIComponent(parts[parts.length - 1]);
    const qIdx = raw.indexOf('?');
    const name = qIdx !== -1 ? raw.substring(0, qIdx) : raw;
    return name || url;
  } catch (_) {
    return url;
  }
}

// Strips a URL down to its last path segment for display, query string
// removed, without decoding (e.g. for showing a short, still-copyable path).
export function getDisplayUrl(url) {
  try {
    const qIdx = url.indexOf('?');
    const clean = qIdx !== -1 ? url.substring(0, qIdx) : url;
    const slashIdx = clean.lastIndexOf('/');
    return slashIdx !== -1 ? clean.substring(slashIdx + 1) : clean;
  } catch (_) {
    return url;
  }
}
