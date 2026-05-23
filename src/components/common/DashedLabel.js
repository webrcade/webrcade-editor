import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CommonTooltip from './CommonTooltip';

export default function DashedLabel({ text, maxWidth = '50ch', minLength = 0 }) {
  if (!text || text.length <= minLength) return null;
  return (
    <CommonTooltip title={text}>
      <Box sx={{
        ml: 1.5,
        py: .5,
        px: 1,
        border: '1px dashed grey',
        maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        opacity: 0.5
      }}>
        <Typography
          variant="caption"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#fff'
          }}
        >{text}</Typography>
      </Box>
    </CommonTooltip>
  );
}
