import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

import * as WrcCommon from '@webrcade/app-common'
import { dropHandler } from '../../Drop';
import { usePrevious } from '../../Util';

export default function CommonImage(props) {
  const {
    defaultImageSrc,
    requiredSize,
    errorCallback,
    onDropText,
    sx
  } = props;

  let imageSrc = props.imageSrc;
  if (imageSrc) imageSrc = WrcCommon.remapUrl(imageSrc);

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

          // Attempt to use proxy
          const proxyImg = new Image();
          proxyImg.onload = (e) => {
            const proxyTarget = e.target;
            setImg(proxyTarget.src);
          }
          proxyImg.onerror = (e) => {            
            setImg(defaultImageSrc);
          }
          const url = encodeURIComponent(target.src);
          //&fpy=0&a=focal          
          //&fit=contain&cbg=00FFFFFF
          proxyImg.src = `https://images.weserv.nl/?url=${url}&w=${requiredSize[0]}&h=${requiredSize[1]}&fit=cover&output=gif`; 
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
      onDrop={(e) => {
        if (onDropText) {
          e.preventDefault();
          dropHandler(e, (text) => { onDropText(text); });
        }
      }}
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