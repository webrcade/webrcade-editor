import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

import * as WrcCommon from '@webrcade/app-common'
import { usePrevious } from '../../Util';

export default function CommonImage(props) {
  const {
    imageSrc,
    defaultImageSrc,
    requiredSize,
    errorCallback,
    sx
  } = props;
  const [img, setImg] = React.useState(null);
  const prevValues = usePrevious({
    imageSrc, defaultImageSrc, requiredSize
  });

  React.useEffect(() => {
    // Only load image if one of the key values have changed
    if (!prevValues || (
      (imageSrc !== prevValues.imageSrc) ||
      (defaultImageSrc !== prevValues.defaultImageSrc) ||
      (requiredSize !== prevValues.requiredSize))) {

console.log('Load image! ' + imageSrc)

      const tempImg = new Image();
      tempImg.onload = (e) => {
        const target = e.target;
        if (requiredSize &&
          (target.naturalWidth !== requiredSize[0] ||
            target.naturalHeight !== requiredSize[1])) {
          const msg = (
            <>
              {`Thumbnail dimensions must be ${requiredSize[0]}x${requiredSize[1]}.`} &nbsp;&nbsp;
              <Link
                underline="none"
                href="https://www.birme.net/?target_width=400&target_height=300&auto_focal=false"
                target="_blank">(Birme)</Link>
              &nbsp;
              <Link
                underline="none"
                href="https://onlinepngtools.com/fit-png-in-rectangle"
                target="_blank">(Rect Fitter)</Link>
            </>
          );
          if (errorCallback) errorCallback(msg);
          setImg(defaultImageSrc);
        } else {
          if (errorCallback) errorCallback(null);
          setImg(target.src);
        }
      }
      tempImg.onerror = (e) => {
        if (errorCallback) errorCallback(
          "The specified image does not exist.");
        setImg(defaultImageSrc);
      }
      tempImg.src = WrcCommon.isValidString(imageSrc) ?
        imageSrc : defaultImageSrc;
    }
  }, [imageSrc, defaultImageSrc, setImg, errorCallback, requiredSize, prevValues]);

  return (
    <Avatar
      variant="rounded"
      sx={{
        backgroundColor: 'black',
        ...sx
      }}
      src={img}
    >
      &nbsp;
    </Avatar>
  );
}