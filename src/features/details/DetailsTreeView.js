import {
  Css as FileIconCss,
  Code as FileIconJs,
  Description as FileIconJson,
  FileCopy as FileIconNpmignore,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function DetailsTreeView({ folder = {}, setCompliancedata = () => {}, complianceData = [] }) {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [treeFolder, setTreeFolder] = useState(folder);

  // Loading initial state from localStorage and initializing the tree folder structure
  useEffect(() => {
    const storedComplianceData = localStorage.getItem('ComplianceTableColumn');
    const storedTreeFolder = localStorage.getItem(folder?.name);

    // If there's stored compliance data, initialize selected items
    if (storedComplianceData) {
      try {
        const complianceDataFromStorage = JSON.parse(storedComplianceData);
        const selectedNames = complianceDataFromStorage.flatMap((item) =>
          item.children.map((child) => child.field)
        );
        setSelectedItems(selectedNames);
      } catch (error) {
        console.error('Error parsing local storage data:', error);
      }
    }

    // If there's stored tree folder data, initialize the tree structure
    if (storedTreeFolder) {
      try {
        setTreeFolder(JSON.parse(storedTreeFolder));
      } catch (error) {
        console.error('Error parsing tree folder data:', error);
        setTreeFolder(folder); // Fallback to the passed folder prop
      }
    }
  }, [folder]);

  const convertToSnakeCase = (inputString) => {
    return inputString.trim().toLowerCase().replace(/\s+/g, '_');
  };

  const updateTreeFolder = (itemName) => {
    const toggleNodeSelection = (currentNode) => {
      if (currentNode.name === itemName) {
        currentNode.selected = !currentNode.selected;
        return true;
      }
      if (currentNode.children) {
        for (let child of currentNode.children) {
          if (toggleNodeSelection(child)) {
            return true;
          }
        }
      }
      return false;
    };

    const updatedTree = JSON.parse(JSON.stringify(treeFolder));
    toggleNodeSelection(updatedTree);
    setTreeFolder(updatedTree);
    localStorage.setItem(folder?.name, JSON.stringify(updatedTree));
    setCompliancedata(updatedTree);
  };

  const makeComplianceColumn = (itemName, node) => {
    const findParent = (currentNode) => {
      if (currentNode.children) {
        for (let child of currentNode.children) {
          if (child.name === itemName) {
            return currentNode;
          }
          const parentNode = findParent(child);
          if (parentNode) return parentNode;
        }
      }
      return null;
    };

    const parentNode = findParent(folder);
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.includes(itemName);
      const updatedSelection = isSelected
        ? prevSelected.filter((item) => item !== itemName)
        : [...prevSelected, itemName];

      let updatedComplianceData = [...complianceData];

      if (isSelected) {
        updatedComplianceData = updatedComplianceData
          .map((item) => {
            if (item.headerName === parentNode.name) {
              item.children = item.children.filter((child) => child.field !== node.name);
            }
            return item;
          })
          .filter((item) => item.children.length > 0);
      } else {
        const existingParent = updatedComplianceData.find(
          (item) => item.headerName === parentNode.name
        );
        if (existingParent) {
          existingParent.children.push({
            headerName: node.name,
            field: convertToSnakeCase(node.name)
          });
        } else {
          updatedComplianceData.push({
            headerName: parentNode.name,
            children: [{ headerName: node.name, field: convertToSnakeCase(node.name) }]
          });
        }
      }

      localStorage.setItem('ComplianceTableColumn', JSON.stringify(updatedComplianceData));
      setCompliancedata(updatedComplianceData);
      return updatedSelection;
    });
  };

  const handleToggleSelection = (itemName, node) => {
    updateTreeFolder(itemName);
    makeComplianceColumn(itemName, node);
  };

  const handleToggleExpand = (itemName) => {
    setExpandedNodes((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(itemName)) {
        newExpanded.delete(itemName);
      } else {
        newExpanded.add(itemName);
      }
      return newExpanded;
    });
  };

  const getFileIcon = (filename) => {
    const extension = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    switch (extension) {
      case 'js':
        return <FileIconJs style={{ marginRight: 8 }} />;
      case 'css':
        return <FileIconCss style={{ marginRight: 8 }} />;
      case 'json':
        return <FileIconJson style={{ marginRight: 8 }} />;
      case 'npmignore':
        return <FileIconNpmignore style={{ marginRight: 8 }} />;
      default:
        return null;
    }
  };

  const renderNode = (node, level = 0) => {
    const isBranch = node?.isFolder;
    if (!node.name) return null;

    return (
      <div style={{ marginLeft: 20 * level }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0px'
          }}
        >
          {!node?.isFolder && (
            <Checkbox
              sx={{
                marginRight: 0,
                padding: '3px'
              }}
              checked={node?.selected || false}
              onChange={() => handleToggleSelection(node.name, node)}
            />
          )}
          {isBranch ? (
            <div
              onClick={() => handleToggleExpand(node.name)}
              style={{ display: 'inline-block', cursor: 'pointer' }}
            >
              {expandedNodes.has(node.name) ? (
                <FolderOpenIcon style={{ marginRight: 8 }} />
              ) : (
                <FolderIcon style={{ marginRight: 8 }} />
              )}
            </div>
          ) : (
            getFileIcon(node.name) || <FileIconJson style={{ marginRight: 8 }} />
          )}
          <Typography>{node.name}</Typography>
        </div>

        {isBranch && expandedNodes.has(node.name) && (
          <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="directory">{treeFolder.children.map((child) => renderNode(child))}</div>
    </div>
  );
}

export default DetailsTreeView;
