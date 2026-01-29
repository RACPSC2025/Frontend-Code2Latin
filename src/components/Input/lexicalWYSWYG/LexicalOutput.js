import React, { useEffect } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { lexicalTheme } from './LexicalTheme';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';

import './LexicalStyles.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function onError(error) {
  console.error(error);
}

function LexicalOutput({ placeholder = 'Loading...', contentToRender }) {
  function Placeholder() {
    return <div className="editor-placeholder">{placeholder}</div>;
  }
  const initialConfig = {
    namespace: 'MyEditor',
    theme: lexicalTheme,
    editable: false,
    editorState: contentToRender,
    nodes: [ListNode, ListItemNode, HeadingNode],
    onError
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <EditorStateUpdater contentToRender={contentToRender} />
        </div>
      </div>
    </LexicalComposer>
  );
}

function EditorStateUpdater({ contentToRender }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (contentToRender) {
      editor.setEditorState(editor.parseEditorState(contentToRender));
    }
  }, [contentToRender, editor]);

  return null;
}

export default LexicalOutput;
