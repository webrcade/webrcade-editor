import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

import * as WrcCommon from '@webrcade/app-common'
import { dropHandler } from '../../Drop';
import { usePrevious } from '../../Util';

export default function CommonImage(props) {
  const {
    defaultImageSrc,
    requiredAspectRatio,
    errorCallback,
    onDropText,
    sx
  } = props;

  let imageSrc = props.imageSrc;
  if (imageSrc) imageSrc = WrcCommon.remapUrl(imageSrc);

  const [img, setImg] = React.useState(null);
  const prevValues = usePrevious({
    imageSrc, defaultImageSrc, requiredAspectRatio
  });

  React.useEffect(() => {
    // Only load image if one of the key values have changed
    if (!prevValues || (
      (imageSrc !== prevValues.imageSrc) ||
      (defaultImageSrc !== prevValues.defaultImageSrc) ||
      (requiredAspectRatio !== prevValues.requiredAspectRatio))) {

      const tempImg = new Image();
      tempImg.onload = (e) => {
        const target = e.target;


        let arTarget = 1;
        let arReq = 1;
        if (requiredAspectRatio) {
          arTarget = (target.naturalWidth/target.naturalHeight).toFixed(2);
          arReq = (requiredAspectRatio[0]/requiredAspectRatio[1]).toFixed(2);
          // console.log('target: ' + arTarget);
          // console.log('req: '+ arReq);
        }

        if (requiredAspectRatio && (arTarget !== arReq)) {
          const msg = (
            <>
              {`Thumbnail has been sized to a ${requiredAspectRatio[0]}:${requiredAspectRatio[1]} aspect ratio.`} &nbsp;&nbsp;
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
          // const proxyImg = new Image();
          // proxyImg.onload = (e) => {
          //   const proxyTarget = e.target;
          //   setImg(proxyTarget.src);
          // }
          // proxyImg.onerror = (e) => {
          //   setImg(defaultImageSrc);
          // }
          // const url = encodeURIComponent(target.src);
          //&fpy=0&a=focal
          //&fit=contain&cbg=00FFFFFF
          //proxyImg.src = `https://images.weserv.nl/?url=${url}&w=${requiredSize[0]}&h=${requiredSize[1]}&fit=cover&output=gif`;

          setImg(target.src);
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
  }, [imageSrc, defaultImageSrc, setImg, errorCallback, requiredAspectRatio, prevValues]);

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