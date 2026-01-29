import {
  CheckBox,
  CheckBoxOutlineBlank,
  ChevronRight,
  IndeterminateCheckBox
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import { isValidArray } from '../utils/others';

const CheckBoxIcon = ({ variant, ...rest }) => {
  const checkboxMapping = {
    all: <CheckBox {...rest} color="primary" />,
    none: <CheckBoxOutlineBlank {...rest} color="primary" />,
    some: <IndeterminateCheckBox {...rest} color="primary" />
  };

  return checkboxMapping[variant] || null;
};

export default function TreeViewComponent({
  folder = {},
  selectedNode = [],
  setSelectedNode = () => {}
}) {
  const [treeFolder, setTreeFolder] = useState({ name: '', children: [] });
  const [selectedIds, setSelectedIds] = useState([]);

  const data = flattenTree(treeFolder);

  const findAllChildNodes = (node) => {
    if (!node.children || node.children.length === 0) {
      return [node]; // If it's a leaf node, return the full object
    }

    // Include all children recursively and return full objects
    return node.children.flatMap(findAllChildNodes);
  };

  const handleNodeSelect = (node, isSelected) => {
    if (!node || !node.id) {
      return;
    }

    const childNodes = findAllChildNodes(node); // Get all child objects (not just IDs)

    setSelectedNode((prevSelectedNode) => {
      // Ensure prevSelectedNode is always an array
      const updatedSelectedNode = isValidArray(prevSelectedNode) ? prevSelectedNode : [];

      if (isSelected) {
        return [
          ...updatedSelectedNode,
          ...childNodes.filter((child) => !updatedSelectedNode.some((item) => item.id === child.id))
        ];
      } else {
        return updatedSelectedNode.filter(
          (item) => !childNodes.some((child) => child.id === item.id)
        );
      }
    });
  };

  useEffect(() => {
    setTreeFolder({ name: '', children: folder });
  }, [folder]);

  useEffect(() => {
    // Ensure selectedNode is an array and handle any errors
    if (!isValidArray(selectedNode)) {
      console.error('selectedNode should be an array.');
      return;
    }

    // Initialize selectedIds based on selectedNode
    const selectedNodeIds = selectedNode.map((node) => node.id);
    setSelectedIds(selectedNodeIds);
  }, [selectedNode]);

  return (
    <Box
      className="checkbox"
      sx={{ backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity, 1))' }}
    >
      <TreeView
        data={data}
        aria-label="Checkbox tree"
        multiSelect
        selectedIds={selectedIds}
        defaultExpandedIds={[1]}
        propagateSelect
        propagateSelectUpwards
        togglableSelect
        onSelect={(props) => {}}
        onNodeSelect={({ element, isSelected }) => {
          handleNodeSelect(element, isSelected);
        }}
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          isSelected,
          isHalfSelected,
          isDisabled,
          getNodeProps,
          level,
          handleSelect,
          handleExpand
        }) => (
          <Box
            {...getNodeProps({ onClick: handleExpand })}
            style={{
              marginLeft: 40 * (level - 1),
              opacity: isDisabled ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {isBranch && (
              <ChevronRight
                sx={{
                  marginLeft: '5px',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            )}
            {!isBranch && (
              <CheckBoxIcon
                sx={{ margin: '0 5px', verticalAlign: 'middle' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(e);
                }}
                variant={isHalfSelected ? 'some' : isSelected ? 'all' : 'none'}
              />
            )}
            <span className="name">{element.name}</span>
          </Box>
        )}
      />
    </Box>
  );
}
