import CommonImage from '../CommonImage'

export default function EditorImage(props) {
  const { 
    sx, 
    src, 
    defaultSrc, 
    requiredSize, 
    errorCallback,
    ...other 
  } = props;
  return (
    <CommonImage
      imageSrc={src}
      defaultImageSrc={defaultSrc}      
      requiredSize={requiredSize}
      errorCallback={errorCallback}
      sx={{
        m: 1.5,
        backgroundColor: 'transparent',
        width: 360,
        height: 270,
        ...sx
      }}
      {...other}
    >
      &nbsp;
    </CommonImage>
  );
}
