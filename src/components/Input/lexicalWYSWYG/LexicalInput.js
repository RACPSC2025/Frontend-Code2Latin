import React, { useState, useEffect } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { LexicalOnChangePlugin } from './LexicalOnChangePlugin';
import { lexicalTheme } from './LexicalTheme';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import ShowSelectionButton from './ShowSelectionButton';
import ReplaceContentButton from './ReplaceContentButton';
import ResumeContentButton from './ResumeContentButton';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'; // 🆕 Importar

import LexicalToolbarPlugin from './LexicalToolbarPlugin';
import LexicalTreeViewPlugin from './LexicalTreeViewPlugin';
import './LexicalStyles.css';

function onError(error) {
  console.error(error);
}

// 🆕 ============================================
// PLUGIN PARA AGREGAR CONTENIDO INCREMENTALMENTE
// ============================================
function AppendContentPlugin({ newBlock, blockIndex }) {
  const [editor] = useLexicalComposerContext();
  const [processedBlocks, setProcessedBlocks] = useState(new Set());

  useEffect(() => {
    if (newBlock && blockIndex !== null && !processedBlocks.has(blockIndex)) {
      editor.update(() => {
        const root = $getRoot();
        
        // Agregar separador visual entre bloques (excepto el primero)
        if (blockIndex > 0) {
          const separator = $createParagraphNode();
          const separatorText = $createTextNode('─'.repeat(50));
          separator.append(separatorText);
          root.append(separator);
        }
        
        // Agregar el texto del nuevo bloque
        const lines = (newBlock.text || '').split('\n');
        
        lines.forEach((line) => {
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(line || ' ');
          paragraph.append(textNode);
          root.append(paragraph);
        });

        // Scroll automático al final
        setTimeout(() => {
          const editorElement = document.querySelector('.editor-input');
          if (editorElement) {
            editorElement.scrollTop = editorElement.scrollHeight;
          }
        }, 100);
      });

      // Marcar este bloque como procesado
      setProcessedBlocks(prev => new Set([...prev, blockIndex]));
    }
  }, [newBlock, blockIndex, editor, processedBlocks]);

  return null;
}
// ============================================

function LexicalInput({ 
  toolbarEnabled = true, 
  treeViewPlugin = false, 
  placeholder,
  JSONData,
  minRows = 5,
  maxRows = 10,
  lineHeight = 24,
  streamingBlock = null,      // 🆕 Prop para streaming
  streamingBlockIndex = null  // 🆕 Prop para índice del bloque
}) {
  const [_, setEditorData] = useState(null);

  const minHeight = minRows * lineHeight;
  const maxHeight = maxRows * lineHeight;

  function Placeholder() {
    return <div className="editor-placeholder">{placeholder}</div>;
  }

  const initialConfig = {
    namespace: 'MyEditor',
    theme: lexicalTheme,
    editable: true,
    nodes: [ListNode, ListItemNode, HeadingNode],
    onError
  };

  const onChange = (editorState) => {
    editorState.read(() => {
      const plainText = $getRoot().getTextContent();
      setEditorData(plainText);
      if (JSONData) {
        JSONData(plainText);
      }
    });
  };

  const editorStyles = {
    minHeight: `${minHeight}px`,
    maxHeight: `${maxHeight}px`,
    overflowY: 'auto',
    lineHeight: `${lineHeight}px`
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {toolbarEnabled && (
          <LexicalToolbarPlugin>
            <ShowSelectionButton 
              label="Selección"
            />
            <ResumeContentButton 
              label="Resumen" 
            />
            <ReplaceContentButton 
              label="Corregir" 
            />
          </LexicalToolbarPlugin>
        )}
        <div className="editor-inner" style={editorStyles}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LexicalOnChangePlugin onChange={onChange} />
          <ListPlugin />
          <AutoFocusPlugin />
          
          {/* 🆕 PLUGIN DE STREAMING INCREMENTAL */}
          <AppendContentPlugin 
            newBlock={streamingBlock} 
            blockIndex={streamingBlockIndex}
          />
          
          {treeViewPlugin && <LexicalTreeViewPlugin />}
        </div>
      </div>
    </LexicalComposer>
  );
}

export default LexicalInput;