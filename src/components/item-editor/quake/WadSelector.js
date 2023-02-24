import * as Util from '../../../Util';
import EditorSelect from "../../common/editor/EditorSelect"
import EditorTextField from "../../common/editor/EditorTextField";

const AUTO = 0;
const QUAKE = 1;
const SCOURGE = 2;
const DISSOLUTION = 3;
const CUSTOM = 100;

const getWadType = (t) => {
  return t ? t : 0;
}

const getWadPath = (t, path) => {
  switch (getWadType(t)) {
    case AUTO:
      return "";
    case QUAKE:
      return "id1/";
    case SCOURGE:
      return "hipnotic/";
    case DISSOLUTION:
      return "rogue/";
    case CUSTOM:
      return Util.asString(path);
    default:
  }
}

export default function WadSelector(props) {
  const { object, setObject } = props;
  return (
    <>
      <div>
        <EditorSelect
          label="Primary game file (.wad)"
          tooltip="The primary game file to launch (.wad file)."
          value={getWadType(object.props.wadType)}
          menuItems={[
            { value: AUTO, name: "Auto-detect" },
            { value: QUAKE, name: "Quake" },
            { value: SCOURGE, name: "Scourge of Armagon (Pack 1)" },
            { value: DISSOLUTION, name: "Dissolution of Eternity (Pack 2)" },
            { value: CUSTOM, name: "Custom" },
          ]}
          onChange={(e) => {
            const value = e.target.value;
            if (value !== CUSTOM) {
              object.props.wadPath = '';
            }
            const props = { ...object.props, wadType: value }
            setObject({ ...object, props })
          }}
        />
      </div>
      {getWadType(object.props.wadType) !== AUTO && (
        <div>
          <EditorTextField
            disabled={getWadType(object.props.wadType) !== CUSTOM}
            sx={{ width: '50ch' }}
            label="Game file path"
            onDropText={(text) => {
              if (getWadType(object.props.wadType) === CUSTOM) {
                const props = { ...object.props, wadPath: text }
                setObject({ ...object, props })
              }
            }}
            onChange={(e) => {
              if (getWadType(object.props.wadType) === CUSTOM) {
                const props = { ...object.props, wadPath: e.target.value }
                setObject({ ...object, props })
              }
            }}
            value={getWadPath(object.props.wadType, object.props.wadPath)}
          />
        </div>
      )}
    </>
  )
}