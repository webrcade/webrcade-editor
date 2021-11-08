import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import CommonImage from './CommonImage'

export default function ImageLabel(props) {
  const { label, imageSrc, defaultImageSrc } = props;

  return (
    <Stack direction="row" sx={{ marginTop: 1.5, marginBottom: 1.5 }}>
      <CommonImage
        imageSrc={imageSrc}
        defaultImageSrc={defaultImageSrc}
        requiredSize={[400, 300]}
        sx={{mr: 1.6, width: 48, height: 36}}        
      />
      <Box component="div" sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column"
      }}>{label}</Box>
    </Stack>
  );
}