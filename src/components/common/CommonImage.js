import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

import * as WrcCommon from '@webrcade/app-common'

export default function CommonImage(props) {
  const {
    imageSrc,
    defaultImageSrc,
    requiredSize,
    errorCallback,
    sx
  } = props;
  const [img, setImg] = React.useState(null);

  React.useEffect(() => {
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
        if (errorCallback) errorCallback(false, msg);
        setImg(defaultImageSrc);
      } else {
        if (errorCallback) errorCallback(true, "");
        setImg(target.src);
      }
    }
    tempImg.onerror = (e) => {
      if (errorCallback) errorCallback(false, 
        "The specified image does not exist.")
      setImg(defaultImageSrc);
    }
    tempImg.src = WrcCommon.isValidString(imageSrc) ?
      imageSrc : defaultImageSrc;
  }, [imageSrc, defaultImageSrc, setImg, errorCallback, requiredSize]);

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