import {
  ArrowRight,
  CheckBox,
  CheckBoxOutlineBlank,
  Folder,
  FolderOff,
  IndeterminateCheckBox,
  InsertDriveFile,
  Refresh
} from '@mui/icons-material';
import cx from 'classnames';
import { useRef, useState } from 'react';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchSubGeovisor } from '../../stores/legal/fetchSubGeovisorSlice';
import { getLegalTree } from '../../stores/legal/getLegalTreeSlice';
import './fileTreeView.css';

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = 'arrow';
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <ArrowRight className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case 'all':
      return <CheckBox {...rest} />;
    case 'none':
      return <CheckBoxOutlineBlank {...rest} />;
    case 'some':
      return <IndeterminateCheckBox {...rest} />;
    default:
      return null;
  }
};

function FileTreeView({ legalTreeData = {}, type = '' }) {
  const dispatch = useDispatch();
  const [loadingError, setLoadingError] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const { t } = useTranslation();

  let treeData = legalTreeData?.children?.map((child) => ({
    ...child,
    isBranch: true
  }));

  let mutatedData = {
    name: '',
    children: treeData
  };

  const handleFetchSubGeovisor = (geovisor_table_name) => {
    if (!geovisor_table_name) return;
    let formData = new FormData();
    formData.append('geovisor_table_name', geovisor_table_name);
    return dispatch(fetchSubGeovisor()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        return data?.payload?.data;
      }
    });
  };

  // const data = flattenTree(legalTreeData);
  const loadedAlertElement = useRef(null);
  const [data, setData] = useState(flattenTree(mutatedData));
  // const [data, setData] = useState(initialData);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };

  const handleFetchLegalTree = (id) => {
    const formData = new FormData();
    formData.append('id', id);
    return dispatch(getLegalTree(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        return data?.payload?.data;
      }
      return [];
    });
  };

  const onLoadData = ({ element }) => {
    const findValue = mutatedData.children.find((child) => child.name === element.name);

    if (type === 'geovisor') {
      try {
        handleFetchSubGeovisor(findValue.value).then((data) => {
          setData((value) =>
            updateTreeData(
              value,
              element.id,
              data?.map((item, index) => ({
                name: item.label,
                children: [],
                id: value.length + index,
                parent: element.id,
                isBranch: false
              }))
            )
          );
        });
      } catch (error) {
        ('');
      }
    } else if (type === 'legal') {
      try {
        handleFetchLegalTree(findValue.value).then((data) => {
          setData((value) =>
            updateTreeData(
              value,
              element.id,
              data.map((item, index) => ({
                name: item.label,
                children: [],
                id: value.length + index,
                parent: element.id,
                isBranch: false
              }))
            )
          );
        });
      } catch (error) {
        ('');
      }
    }
  };

  function generateTree(nodes) {
    // Create an empty object to store the nodes grouped by parent
    const groupedNodes = {};

    // Loop over the nodes
    for (let node of nodes) {
      // If the parent property doesn't exist in groupedNodes, add it
      if (!groupedNodes[node.Parent]) {
        groupedNodes[node.Parent] = {
          Parent: node.Parent,
          children: []
        };
      }

      // Add the node to the children array of its parent
      groupedNodes[node.Parent].children.push(node);
    }

    // Convert the groupedNodes object to an array and return it
    return Object.values(groupedNodes);
  }

  const handleDataSelect = (e, element) => {
    // If the element is already selected, remove it from the selectedNodes array
    if (selectedNodes.some((node) => node.id === element.id)) {
      setSelectedNodes(selectedNodes.filter((node) => node.id !== element.id));
    } else {
      // If the element is not selected, add it to the selectedNodes array
      setSelectedNodes([...selectedNodes, element]);
    }
    const tree = generateTree(selectedNodes);
    e.stopPropagation();
  };

  const wrappedOnLoadData = async (props) => {
    const nodeHasNoChildData = props.element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find((e) => e.id === props.element.id);

    await onLoadData(props);

    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      const el = loadedAlertElement.current;
      setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
      el && (el.innerHTML = `${props.element.name} loaded`);

      // Clearing aria-live region so loaded node alerts no longer appear in DOM
      setTimeout(() => {
        el && (el.innerHTML = '');
      }, 5000);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      // handle filtering
    }
  };

  return (
    <div className="treeViewWrapper">
      <div>
        <label htmlFor="txtToFilter">{t('text_to_filter')}: </label>
        <input id="txtToFilter" type="text" onKeyDown={onKeyDown} />
        <button onClick={() => {}}>{t('apply')}</button>
      </div>
      <div
        className="visually-hidden"
        ref={loadedAlertElement}
        role="alert"
        aria-live="polite"
      ></div>
      <div className="checkbox">
        <TreeView
          data={data}
          onLoadData={wrappedOnLoadData}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            isHalfSelected,
            getNodeProps,
            level,
            handleSelect,
            handleExpand
          }) => {
            const branchNode = (isExpanded, element) => {
              if (isExpanded && element.children.length === 0) {
                if (loadingError) {
                  return (
                    <span>
                      <FolderOff className="icon" />
                    </span>
                  );
                } else {
                  return (
                    <>
                      <span role="alert" aria-live="assertive" className="visually-hidden">
                        {element.name}
                      </span>
                      <Refresh aria-hidden={true} className="loading-icon" />
                    </>
                  );
                }
              } else {
                return <ArrowIcon isOpen={isExpanded} />;
              }
            };
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{ marginLeft: 40 * (level - 1) }}
              >
                {isBranch && branchNode(isExpanded, element)}
                <CheckBoxIcon
                  className="checkbox-icon"
                  onClick={(e) => {
                    handleSelect(e);
                    handleDataSelect(e, element);
                    e.stopPropagation();
                  }}
                  variant={isHalfSelected ? 'some' : isSelected ? 'all' : 'none'}
                  // TODO: change checkboxicon to an actual control
                  disabled={isExpanded && element.children.length === 0 && !loadingError}
                />
                <span className="name">
                  {level === 1 ? <Folder className="icon" /> : <InsertDriveFile className="icon" />}
                  {element.name}
                </span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export default FileTreeView;
