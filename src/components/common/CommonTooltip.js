import Tooltip from '@mui/material/Tooltip';

export default function CommonTooltip(props) {
  const {title, children} = props;

  return (
    <Tooltip
      disableInteractive
      enterDelay={500}
      enterNextDelay={500}
      arrow={true}
      title={title}
      placement='right'
    >
      {children}
    </Tooltip>
  );
}