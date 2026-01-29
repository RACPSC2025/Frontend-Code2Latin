import {
  AddToPhotos,
  AutoAwesome,
  ExpandLess,
  ExpandMore,
  LabelImportant,
  MoreVert,
  AttachFile,
  EventNoteTwoTone
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography
} from '@mui/material';
import { $getRoot, $getTextContent, $getSelection, $isRangeSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useTranslation } from 'react-i18next';

import { evalWithIA, evalpdfIA, evalAnalysis } from '../../../stores/legal/fetchListLegalsSlice';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  selectAppliedFilterModel,
  setFilter
} from '../../../stores/filterSlice';
//} from '../stores/filterSlice';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));


//export default function ShowSelectionButton() {
export default function ShowSelectionButton({ label = "Agregar" }) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dataList = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'article_data_list')
  ) || [];


  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error("El módulo es undefined o inválido");
      console.log("El módulo es undefined o inválido");
      return;
    }
    const payload = { 
      module, 
      updatedFilter: { [id]: value } // Debe estar dentro de `updatedFilter`
    };
    dispatch(setFilter(payload));
  };

  
  const handleAIrequest = (evalText) => {
   
    console.log("se hace request de texto a la API de la IA");
    
    dispatch(evalWithIA(evalText)).then((data) => {
      const response = data?.payload;
    
      if (data?.payload?.messages === 'Success') {
        if (Array.isArray(response?.data) && response.data.length > 0) {
          console.log("AI TEXT Response");
          console.log(response);
      
          const updatedArticleList = [...response.data, ...dataList];
          handleSetFilterItemValue('legalMatrix', 'article_data_list', updatedArticleList);
        } else {
          console.log("response.data no es un array o está vacío:", response.data);
        }
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          console.log("Error :", response);
        }
      }
    });
  };


  const handleClick = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        if (!(selectedText === '')) {
          //console.log(`Texto seleccionado: ${selectedText}`);
          createNewArticle(selectedText);
        } else {
          //console.log('No hay texto seleccionado');
        }
      } else {
        //console.log('No hay texto seleccionado');
      }
    });
  };

  const createNewArticle = (newText) => {
    const trimmedText = newText.trim();

    /*
    const newArticle = {
      article_name: '',
      article_number: null,
      criticity: "high",
      number: null,
      requirement_description: trimmedText,
      requirement_name: trimmedText,
      type: "Article"

    };
    */
    handleAIrequest(trimmedText); // Llamar a la función para hacer la solicitud a la IA

    //const updatedArticleList = [newArticle, ...articleDataList];
    //handleSetFilterItemValue('legalMatrix', 'article_data_list', updatedArticleList); // Guardar el valor en Redux
  }

  return (
    <>
      <div className="divider"></div>
      <Tooltip key={'select_text'} title={t(label)}>
        <Typography
          onClick={handleClick}
          color="primary"
          sx={{
            marginLeft: '3px',
            color: 'gray',
            backgroundColor: 'rgba(245, 245, 245, 0.306)',
            border: '1px solid #c5c5c5',
            borderRadius: '4px',
            padding: '8px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            width: '45px',
            height: '45px'
          }}
        >
          <EventNoteTwoTone
            sx={{
              width: '28px',
              height: '28px'
            }}
          />
        </Typography>
      </Tooltip>
    </>
  );
}
