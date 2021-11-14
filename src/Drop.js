import { isValidString } from '@webrcade/app-common'

const dropHandler = (e, cb) => {
  let resolved = [false];
  const len = e.dataTransfer.items.length;

  for (let i = 0; i < len; i++) {
    const item = e.dataTransfer.items[i];
    
    if (item.kind === 'string' &&
      (item.type.match('^text/uri-list') || item.type.match('^text/plain'))) {      
      item.getAsString((text) => {
        if (resolved[0]) return;
        if (isValidString(text)) {
          resolved[0] = true;
          cb(text)          
        }
      });
    }
  }
}

export { dropHandler }
