import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import ClearIcon from '@mui/icons-material/Clear';

import * as Feed from '../Feed';
import * as Util from '../Util';
import BackgroundTab from './common/editor/BackgroundTab';
import CommonTooltip from './common/CommonTooltip';
import DashedLabel from './common/DashedLabel';
import GeneralTab from './common/editor/GeneralTab';
import Editor from './common/editor/Editor';
import EditorButton from './common/editor/EditorButton';
import EditorTabPanel from './common/editor/EditorTabPanel';
import EditorTextField from './common/editor/EditorTextField';
import EditorValidator from './common/editor/EditorValidator'
import SelectType from './item-editor/SelectType';
import ThumbnailTab from './common/editor/ThumbnailTab';
import { openSelectCloudFolderDialog } from './cloud/generate-manifest/SelectCloudFolderDialog';
import { GlobalHolder, Global } from '../Global';
import { uploadImageFile } from '../LocalFileProcessor';

import * as WrcCommon from '@webrcade/app-common';
import {
  CategoryBackgroundImage,
  CategoryThumbImage
} from '@webrcade/app-common'

const validator = new EditorValidator();

const addValidatorCallback = (id, cb) => {
  validator.addCallback(id, cb);
}

function CloudTab({ tabValue, tabIndex, object, setObject }) {
  const feed = Global.getFeed();

  const overrideLocation = object.cloudLocation || '';
  const defaultSubdir    = Feed.slugify(object.title);
  const cloudSubdir      = object.cloudSubdir !== undefined ? object.cloudSubdir : defaultSubdir;
  const resolvedPath     = Feed.resolveCategoryCloudPath(feed, object);

  return (
    <EditorTabPanel value={tabValue} index={tabIndex}>
      <Box>
        <SelectType
          label="Default Application"
          allowNone
          item={{ type: object.defaultType || '' }}
          setItem={(newItem) => setObject({ ...object, defaultType: newItem.type || undefined })}
        />
      </Box>
      <Box>
        <Stack spacing={0} direction="row" alignItems="center">
          <EditorTextField
            sx={{ width: '50ch' }}
            label="Cloud Override Location (optional)"
            tooltip="If set, replaces the feed's cloud root as the base path for this category."
            value={overrideLocation}
            InputProps={{
              readOnly: true,
              endAdornment: overrideLocation ? (
                <InputAdornment position="end">
                  <CommonTooltip title="Clear override">
                    <IconButton
                      onClick={() => setObject({ ...object, cloudLocation: '' })}
                      size="small"
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </CommonTooltip>
                </InputAdornment>
              ) : null,
            }}
          />
          <EditorButton
            label="Select folder..."
            onClick={() => {
              openSelectCloudFolderDialog((model, node) => {
                setObject({ ...object, cloudLocation: node.path });
              });
            }}
          />
        </Stack>
      </Box>
      <Box>
        <EditorTextField
          sx={{ width: '50ch' }}
          label="Sub-Directory"
          tooltip="Sub-folder appended to the base path (feed root or override). Defaults to the category name."
          value={cloudSubdir}
          onChange={(e) => setObject({ ...object, cloudSubdir: e.target.value })}
          InputProps={{
            endAdornment: (object.cloudSubdir !== undefined) ? (
              <InputAdornment position="end">
                <CommonTooltip title="Reset to default">
                  <IconButton
                    onClick={() => { const { cloudSubdir, ...rest } = object; setObject(rest); }}
                    size="small"
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </CommonTooltip>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>
      <DashedLabel text={resolvedPath} minLength={1} />
    </EditorTabPanel>
  );
}

export default function CategoryEditor(props) {
  const [tabValue, setTabValue] = React.useState(0);
  const [category, setCategory] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);
  const [isCreate, setCreate] = React.useState(false);

  GlobalHolder.setCategoryEditorOpen = (open, isCreate = false) => {
    setCreate(isCreate);
    setOpen(open);
  }
  GlobalHolder.setEditCategory = setCategory;

  const forceUpdate = Util.useForceUpdate();

  const genTab = 0;
  const cloudEnabled = WrcCommon.settings.isCloudStorageEnabled();
  const cloudTab = cloudEnabled ? 1 : -1;
  const thumbTab = cloudEnabled ? 2 : 1;
  const bgTab = cloudEnabled ? 3 : 2;

  return (
    <Editor
      title={`${isCreate ? "Create" : "Edit"} Category`}
      isOpen={isOpen}
      setOpen={setOpen}
      tabValue={tabValue}
      setTabValue={setTabValue}
      onShow={() => {
        validator.reset();
        setCategory(Util.cloneObject(category))
        forceUpdate();
      }}
      onOk={() => {
        validator.executeCallbacks();
        const minTab = validator.getMinInvalidTab();
        if (minTab >= 0) {
          setTabValue(minTab);
          forceUpdate();
          return false;
        }

        // Get the feed
        const feed = Global.getFeed();
        // Replace the category in the feed
        if (isCreate) {
          Feed.addCategoryToFeed(feed, category);
        } else {
          Feed.replaceCategory(feed, category.id, category);
        }
        // Update the feed (shallow clone)
        Global.setFeed({ ...feed });

        return true;
      }}
      tabs={[
        <Tab label="General" key={genTab} />,
        ...(cloudEnabled ? [<Tab label="Cloud Storage" key={cloudTab} />] : []),
        <Tab label="Thumbnail" key={thumbTab} />,
        <Tab label="Background" key={bgTab} />,
      ]}
      tabPanels={(
        <>
          <GeneralTab
            tabValue={tabValue}
            tabIndex={genTab}
            object={category}
            setObject={setCategory}
            validator={validator}
            addValidateCallback={addValidatorCallback}
          />
          {cloudEnabled && (
            <CloudTab
              tabValue={tabValue}
              tabIndex={cloudTab}
              object={category}
              setObject={setCategory}
            />
          )}
          <ThumbnailTab
            tabValue={tabValue}
            tabIndex={thumbTab}
            thumbSrc={category.thumbnail}
            defaultThumbSrc={CategoryThumbImage}
            object={category}
            setObject={setCategory}
            onFileUpload={cloudEnabled ? (file, onProgress) => uploadImageFile(file, Feed.resolveCategoryImagesPath(Global.getFeed(), category), category.title, onProgress) : undefined}
          />
          <BackgroundTab
            tabValue={tabValue}
            tabIndex={bgTab}
            thumbSrc={category.background}
            defaultThumbSrc={CategoryBackgroundImage}
            object={category}
            setObject={setCategory}
            onFileUpload={cloudEnabled ? (file, onProgress) => uploadImageFile(file, Feed.resolveCategoryImagesPath(Global.getFeed(), category), category.title, onProgress) : undefined}
          />
        </>
      )}
    />
  );
}
