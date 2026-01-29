import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jstree';
import 'jstree/dist/themes/default/style.min.css';

const JSTreeComponent = ({ treeId, data, onSelectionChange }) => {
  const treeRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const $tree = $(`#${treeId}`);
    
    // Destruir instancia previa si existe
    if ($tree.jstree(true)) {
      $tree.jstree('destroy');
    }

    // Inicializar JSTree
    $tree.jstree({
      core: {
        data: data,
        themes: {
          icons: true
        }
      },
      checkbox: {
        keep_selected_style: false,
        three_state: true,
        cascade: 'up+down+undetermined'
      },
      plugins: ['checkbox']
    });

    // Manejar cambios en la selección
    $tree.on('changed.jstree', function (e, data) {
      if (onSelectionChange) {
        const selectedNodes = data.instance.get_selected(true);
        onSelectionChange(selectedNodes);
      }
    });

    // Cleanup
    return () => {
      if ($tree.jstree(true)) {
        $tree.off('changed.jstree');
        $tree.jstree('destroy');
      }
    };
  }, [treeId, data, onSelectionChange]);

  return <div id={treeId} ref={treeRef} style={{ minHeight: '200px' }} />;
};

export default JSTreeComponent;
