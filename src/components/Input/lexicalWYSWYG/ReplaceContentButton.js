import { EventNoteTwoTone } from '@mui/icons-material';
import { Spellcheck } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useTranslation } from 'react-i18next';
import { evalWithIAcorrection } from '../../../stores/legal/fetchListLegalsSlice';
import { useDispatch } from 'react-redux';

export default function ReplaceContentButton({ label = "Reemplazar" }) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAIrequest = async (fullText) => {
    try {
      const action = await dispatch(evalWithIAcorrection(fullText));
      const payload = action?.payload ?? action;
      console.log('evalWithIAcorrection payload ->', payload);

      // Normalizar dónde puede venir el "contenido"
      let candidate;
      if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) candidate = payload.data;
      else if (payload && Object.prototype.hasOwnProperty.call(payload, 'text')) candidate = payload.text;
      else if (payload && Object.prototype.hasOwnProperty.call(payload, 'content')) candidate = payload.content;
      else candidate = payload;

      // Convertir candidate a string de forma segura
      let newContent = '';
      if (Array.isArray(candidate)) {
        newContent = candidate
          .map(item => (typeof item === 'string' ? item : JSON.stringify(item)))
          .join('\n');
      } else if (typeof candidate === 'string') {
        newContent = candidate;
      } else if (candidate && typeof candidate === 'object') {
        // Buscar campos comunes dentro del objeto
        const keysToTry = ['text', 'result', 'content', 'body', 'message', 'reply'];
        let found = false;
        for (const k of keysToTry) {
          if (typeof candidate[k] === 'string') {
            newContent = candidate[k];
            found = true;
            break;
          }
          if (Array.isArray(candidate[k])) {
            newContent = candidate[k]
              .map(item => (typeof item === 'string' ? item : JSON.stringify(item)))
              .join('\n');
            found = true;
            break;
          }
        }
        if (!found) {
          // Fallback: serializar el objeto
          try {
            newContent = JSON.stringify(candidate);
          } catch (e) {
            newContent = String(candidate);
          }
        }
      } else if (candidate != null) {
        newContent = String(candidate);
      }

      newContent = String(newContent); // asegurar tipo string

      if (newContent.trim().length === 0) {
        console.warn('La API no devolvió texto útil (string vacío). No se reemplaza el contenido.');
        return;
      }

      // Insertar en editor como párrafos (respetando saltos de línea)
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const lines = newContent.split(/\r?\n/);
        lines.forEach((line) => {
          const p = $createParagraphNode();
          p.append($createTextNode(line));
          root.append(p);
        });
      });
    } catch (err) {
      console.error('Error en handleAIrequest:', err);
    }
  };

  const handleClick = () => {
    editor.update(() => {
      const fullText = $getRoot().getTextContent();
      if (!fullText || !String(fullText).trim()) {
        console.warn('Editor vacío: no se envía request a la IA.');
        return;
      }
      handleAIrequest(fullText);
    });
  };

  return (
    <>
      <div className="divider" />
      <Tooltip key={'replace_text'} title={t(label)}>
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
          <Spellcheck sx={{ width: '28px', height: '28px' }} />
        </Typography>
      </Tooltip>
    </>
  );
}