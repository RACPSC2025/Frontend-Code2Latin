/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
  Redo,
  StrikethroughS,
  Undo
} from '@mui/icons-material';

const LowPriority = 1;
export const FORMAT_HEADING_COMMAND = createCommand('FORMAT_HEADING_COMMAND;');

function Divider() {
  return <div className="divider" />;
}

export default function LexicalToolbarPlugin({ children }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [textType, setTextType] = useState('p');
  const [textAlign, setTextAlign] = useState('left');
  const [textList, setTextList] = useState('');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  const formatList = (listType) => {
    if (listType === 'number' && blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType('number');
    } else if (listType === 'bullet' && blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType('bullet');
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        FORMAT_HEADING_COMMAND,
        (payload) => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(payload));
            setTextType(payload);
          }
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  function handleTextType(event, newType) {
    setTextType(newType);
    editor.dispatchCommand(FORMAT_HEADING_COMMAND, newType);
  }

  function handleTextAlign(event, newAlignment) {
    setTextAlign(newAlignment);
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, newAlignment);
  }

  function handleTextList(event, newList) {
    setTextList(newList);
    formatList(newList);
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      <IconButton
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <Undo />
      </IconButton>
      <IconButton
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <Redo />
      </IconButton>
      <Divider />
      <IconButton
        variant="outlined"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold"
      >
        <FormatBold />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
      >
        <FormatItalic />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
      >
        <FormatUnderlined />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
      >
        <StrikethroughS />
      </IconButton>
      <Divider />
      <ToggleButtonGroup size="small" exclusive value={textList} onChange={handleTextList}>
        <ToggleButton value="bullet">
          <FormatListBulleted />
        </ToggleButton>
        <ToggleButton value="number">
          <FormatListNumbered />
        </ToggleButton>
      </ToggleButtonGroup>
      <Divider />
      <ToggleButtonGroup size="small" exclusive value={textAlign} onChange={handleTextAlign}>
        <ToggleButton value="left">
          <FormatAlignLeft />
        </ToggleButton>
        <ToggleButton value="center">
          <FormatAlignCenter />
        </ToggleButton>
        <ToggleButton value="right">
          <FormatAlignRight />
        </ToggleButton>
      </ToggleButtonGroup>
      <Divider />
      <ToggleButtonGroup
        value={textType}
        exclusive
        onChange={handleTextType}
        aria-label="text type"
      >
        <ToggleButton value="p">p</ToggleButton>
        <ToggleButton value="h1">H1</ToggleButton>
        <ToggleButton value="h2">H2</ToggleButton>
      </ToggleButtonGroup>
      
      {children}
    </div>
  );
}
