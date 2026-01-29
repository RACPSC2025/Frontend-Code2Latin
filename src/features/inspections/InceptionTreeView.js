import { AddToPhotos, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TreeViewComponent from '../../components/TreeViewComponent';

export default function InceptionTreeView({ selectedNode = [], setSelectedNode = () => {} }) {
  const { t } = useTranslation();
  const [openList, setOpenList] = useState({});

  const toggleListOpen = (index) => {
    setOpenList((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const asiaArray = [
    {
      id: 1,
      name: 'ASIA',
      children: [
        {
          id: 2,
          name: 'India',
          children: [
            {
              id: 3,
              name: 'Rajasthan',
              children: [
                { id: 4, name: 'Jaipur' },
                { id: 5, name: 'Jodhpur' },
                { id: 6, name: 'Udaipur' },
                { id: 7, name: 'Kota' }
              ]
            },
            {
              id: 8,
              name: 'Gujarat',
              children: [
                { id: 9, name: 'Ahmedabad' },
                { id: 10, name: 'Surat' },
                { id: 11, name: 'Rajkot' },
                { id: 12, name: 'Vadodara' }
              ]
            },
            {
              id: 13,
              name: 'Maharashtra',
              children: [
                { id: 14, name: 'Mumbai' },
                { id: 15, name: 'Pune' },
                { id: 16, name: 'Nagpur' },
                { id: 17, name: 'Nashik' }
              ]
            },
            { id: 18, name: 'Punjab' },
            { id: 19, name: 'Delhi' }
          ]
        },
        {
          id: 20,
          name: 'China',
          children: [
            {
              id: 21,
              name: 'Guangdong',
              children: [
                { id: 22, name: 'Guangzhou' },
                { id: 23, name: 'Shenzhen' },
                { id: 24, name: 'Dongguan' }
              ]
            },
            {
              id: 25,
              name: 'Beijing',
              children: [
                { id: 26, name: 'Chaoyang' },
                { id: 27, name: 'Haidian' }
              ]
            },
            {
              id: 28,
              name: 'Shanghai',
              children: [
                { id: 29, name: 'Pudong' },
                { id: 30, name: 'Minhang' }
              ]
            }
          ]
        },
        {
          id: 31,
          name: 'Russia',
          children: [
            {
              id: 32,
              name: 'Moscow Oblast',
              children: [
                { id: 33, name: 'Moscow' },
                { id: 34, name: 'Zelenograd' }
              ]
            },
            { id: 35, name: 'Saint Petersburg' }
          ]
        },
        {
          id: 36,
          name: 'Pakistan',
          children: [
            {
              id: 37,
              name: 'Punjab',
              children: [
                { id: 38, name: 'Lahore' },
                { id: 39, name: 'Rawalpindi' }
              ]
            },
            {
              id: 40,
              name: 'Sindh',
              children: [
                { id: 41, name: 'Karachi' },
                { id: 42, name: 'Hyderabad' }
              ]
            }
          ]
        },
        {
          id: 43,
          name: 'Sri Lanka',
          children: [
            {
              id: 44,
              name: 'Western Province',
              children: [
                { id: 45, name: 'Colombo' },
                { id: 46, name: 'Gampaha' }
              ]
            },
            {
              id: 47,
              name: 'Central Province',
              children: [
                { id: 48, name: 'Kandy' },
                { id: 49, name: 'Matale' }
              ]
            }
          ]
        },
        {
          id: 50,
          name: 'Japan',
          children: [
            { id: 51, name: 'Tokyo' },
            { id: 52, name: 'Osaka' },
            { id: 53, name: 'Kyoto' }
          ]
        },
        {
          id: 54,
          name: 'Indonesia',
          children: [
            {
              id: 55,
              name: 'Java',
              children: [
                { id: 56, name: 'Jakarta' },
                { id: 57, name: 'Surabaya' }
              ]
            },
            {
              id: 58,
              name: 'Bali',
              children: [{ id: 59, name: 'Denpasar' }]
            }
          ]
        }
      ]
    }
  ];

  const dataList = [
    {
      listName: 'asia',
      content: (
        <TreeViewComponent
          folder={asiaArray}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      )
    },
    {
      listName: 'africa',
      content: 'africa'
    },
    {
      listName: 'north_america',
      content: 'north_america'
    },
    {
      listName: 'south_america',
      content: 'south_america'
    },
    {
      listName: 'antarctica',
      content: 'antarctica'
    },
    {
      listName: 'europe',
      content: 'europe'
    },
    {
      listName: 'australia',
      content: 'australia'
    }
  ];

  return (
    <Box className="w-full">
      <List component="nav" className="w-full p-0 flex flex-col">
        {dataList.map((data, index) => (
          <Fragment key={index}>
            <ListItemButton
              onClick={() => toggleListOpen(index)}
              sx={{
                border: '1px solid rgb(209, 208, 208)'
              }}
            >
              <ListItemIcon>
                <AddToPhotos />
              </ListItemIcon> 
              <ListItemText primary={t(data.listName)} />
              {openList[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={!!openList[index]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="px-2 py-1 bg-gray-100">
                {data?.content}
              </List>
            </Collapse>
            {dataList?.length - 1 !== index && <Divider sx={{ my: '1px' }} />}
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
