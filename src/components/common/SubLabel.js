import * as React from 'react';
import Typography from '@mui/material/Typography';

/**
 * SubLabel — secondary caption text used as the second row beneath a filename.
 * Renders slightly dimmer than MUI's default text.secondary so it visually
 * recedes behind the primary filename without becoming unreadable.
 */
export default function SubLabel({ children, sx, ...props }) {
  return (
    <Typography
      variant="caption"
      sx={{ color: 'rgba(255,255,255,0.45)', ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
}
