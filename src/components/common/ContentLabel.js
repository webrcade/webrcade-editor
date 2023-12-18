import * as React from 'react';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

export default function ContentLabel(props) {
  const { label, content, onClick } = props;
  const theme = useTheme();

  const sx = {}
  if (onClick) {
    sx.cursor = 'pointer';
  }

  return (
    <Stack onClick={onClick} direction="row"
      sx={{
        marginTop: 1.5,
        marginBottom: 1.5,
        ...sx
      }}>
      {content}
      <Box component="div" sx={{
        ml: .5,
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}>
        <Typography
          sx={{
            color: theme.palette.primary.main
          }}
        >
          {label}
        </Typography>
      </Box>
    </Stack>
  );
}