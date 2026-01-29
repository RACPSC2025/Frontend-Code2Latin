import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseEmptyState from '../../components/BaseEmptyState';
import BaseTab from '../../components/BaseTab';
import CommentCard from '../../components/CommentCard';
import FormBuilder from '../../components/FormBuilder';
import { editActionComments } from '../../stores/actions/editActionCommentsSlice';
import { fetchActionComments } from '../../stores/actions/fetchActionCommentsSlice';
import { showSuccessMsg } from '../../utils/others';

export default function ActionsComments({ actionDetails = {} }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('list');
  const [commentModel, setCommentModel] = useState({ comment: '', comment_id: null });

  const { loading: actionCommentsLoading = false, data: actionCommentsData = {} } = useSelector(
    (state) => state?.fetchActionComments || {}
  );

  const { loading: editActionCommentsLoading = false } = useSelector(
    (state) => state?.editActionComments || {}
  );

  const actionComments = actionCommentsData?.data || [];

  const handleFetchActionComments = ({ action_id, action_table }) => {
    dispatch(fetchActionComments({ action_id, action_table }));
  };

  const handleAddEditComments = (payload, resetFormFields) => {
    dispatch(editActionComments(payload)).then((data) => {
      if (data?.payload?.status === 1) {
        showSuccessMsg(data?.payload?.messages);
        resetFormFields();
        setActiveTab('list');
      }
    });
  };

  const handleFormSuccess = (updatedFormModel, resetFormFields) => {
    const { action_table, action_id, module_id } = actionDetails;
    const { comment, comment_id, filePicker = null } = updatedFormModel;

    const formData = new FormData();
    formData.append('action_table', action_table);
    formData.append('action_id', action_id);
    formData.append('module_id', module_id);
    formData.append('comment', comment);

    if (comment_id) {
      formData.append('comment_id', comment_id);
    }

    if (filePicker) {
      formData.append('attachment', filePicker);
    }

    handleAddEditComments(formData, resetFormFields);
  };

  const handleFormCancel = () => {
    setActiveTab('list');
    setCommentModel({ comment: '', comment_id: null });
  };

  const handleClickCommentEdit = (commentObj) => {
    const { comment, id: comment_id } = commentObj;
    setCommentModel({ comment, comment_id });
    setActiveTab('form');
  };

  const getCommentTemplate = () => {
    if (actionCommentsLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <CommentCard
          key={`mc_shimmer_${index}`}
          loading
          wrapperStyle={index > 0 ? { mt: 1 } : {}}
        />
      ));
    }

    if (actionComments.length > 0) {
      return actionComments.map((comment, index) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          wrapperStyle={index > 0 ? { mt: 1 } : {}}
          onClickEdit={() => handleClickCommentEdit(comment)}
        />
      ));
    }

    return <BaseEmptyState module="actions" section="comment_list" />;
  };

  const tabItems = [
    { key: 'list', label: t('list') },
    { key: 'form', label: t('form') }
  ];

  useEffect(() => {
    if (activeTab === 'list' && actionDetails?.action_id && actionDetails?.action_table) {
      handleFetchActionComments({
        action_id: actionDetails?.action_id,
        action_table: actionDetails?.action_table
      });
    }
  }, [activeTab, actionDetails]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <BaseTab
        items={tabItems}
        activeTab={tabItems.findIndex((tab) => tab.key === activeTab)}
        tabContainerProps={{
          sx: { my: 2 },
          onChange: (_, value) => setActiveTab(tabItems[value].key)
        }}
        // showBorderBottom
      />
      <Box
        sx={{
          px: 2,
          pt: activeTab === 'form' ? 1 : 2,
          pb: 2,
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto'
        }}
      >
        {activeTab === 'list' ? (
          getCommentTemplate()
        ) : (
          <FormBuilder
            inputFields={[
              { id: 'comment', type: 'textarea', label: 'Comment', required: true },
              { id: 'filePicker', type: 'file', label: 'Upload File', required: false }
            ]}
            initialValues={commentModel}
            isLoading={editActionCommentsLoading}
            successCallback={handleFormSuccess}
            cancelCallback={handleFormCancel}
          />
        )}
      </Box>
    </Box>
  );
}
