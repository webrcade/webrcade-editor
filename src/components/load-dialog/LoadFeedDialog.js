import * as React from 'react';
import Tab from '@mui/material/Tab';

import * as WrcCommon from '@webrcade/app-common'

import { GlobalHolder } from '../../Global';
import Editor from '../common/editor/Editor';
import EditorTabPanel from '../common/editor/EditorTabPanel';
import FeedsTable from './FeedsTable';

const setTabValue = () => { };

export default function LoadFeedDialog(props) {
  const [isOpen, setOpen] = React.useState(false);
  const [feeds, setFeeds] = React.useState(null);

  GlobalHolder.setLoadFeedDialogOpen = setOpen;

  const loadTab = 0;

  const onOk = () => {
    return true;
  }

  return (
    <Editor
      title="Load Feed"
      height={400}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={loadTab}
      setTabValue={setTabValue}
      closeButton={true}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)', // Make darker due to table over table
        }
      }}
      onShow={async () => {
        const feeds = await WrcCommon.loadFeeds(0);
        setFeeds(feeds);
      }}
      onOk={onOk}
      onSubmit={() => {
        if (onOk()) {
          setOpen(false);
        }
      }}
      tabs={[
        <Tab label="Load" key={loadTab} />,
      ]}
      tabPanels={(
        <>
          <EditorTabPanel value={loadTab} index={loadTab}>
            <FeedsTable
              feeds={feeds}
              setOpen={setOpen}
              onDelete={async () => {
                const feeds = await WrcCommon.loadFeeds(0);
                setFeeds(feeds);
              }}
            />
          </EditorTabPanel>
        </>
      )}
    />
  );
}