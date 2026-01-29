import { Close } from '@mui/icons-material';
import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { isEmpty, isObject } from 'radash';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getActionDetails } from '../../stores/actions/getActionDetailsSlice';
import { submitActionForm } from '../../stores/actions/submitActionFormSlice';
import { showErrorMsg, showSuccessMsg } from '../../utils/others';

const ActionsDetails = lazy(() => import('./ActionsDetails'));
const ActionsComments = lazy(() => import('./ActionsComments'));

export default function ActionsDrawer({
  drawerOpen = false,
  handleCloseDrawer = () => {},
  viewType = null,
  handleFetchActionList = () => {},
  selectedAction = null,
  formFields = [],
  formTabItems = [],
  actionFormModel = {},
  setActionFormModel = () => {},
  setFormFields = () => {}
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const drawerStyleAttrs = {
    view_action: {
      sx: {
        maxWidth: '50vw',
        width: {
          sm: '50vw',
          md: '30vw',
          lg: '45vw'
        }
      }
    },
    view_comment: {
      sx: {
        maxWidth: '50vw',
        width: {
          lg: '45vw',
          xl: '32vw',
          xxl: '40vw'
        }
      }
    }
  };

  //const drawerTitle = viewType === 'view_action' ? 'Action Details' : 'Action Comment(s)';
  const drawerTitle = viewType === 'view_action' ? 'Action Details' : 'Comentarios de la acción';

  const actionDetailsLoading = useSelector((state) => state?.getActionDetails?.loading ?? false);

  const flattenFormFields = () => {
    const formFieldGroups = Object.keys(formFields);
    return formFieldGroups.reduce((acc, cur) => {
      const fieldMapping = formFields[cur];
      return [...acc, ...Object.keys(fieldMapping).map((fieldKey) => fieldMapping[fieldKey])];
    }, []);
  };

  const getFormFieldGroup = (fieldID) => {
    const formFieldGroups = Object.keys(formFields);
    const group = formFieldGroups.find((fieldGroup) => {
      const fieldIDs = Object.keys(formFields[fieldGroup]);
      return fieldIDs.includes(fieldID);
    });
    return group;
  };

  const checkDependentFields = (id, value) => {
    const findFormField = (id) => flattenFormFields().find((field) => field.name === id);

    const formField = findFormField(id);
    const { dependent = [] } = formField || {};

    if (dependent.length) {
      const [firstDependentID] = dependent;
      //Clear the next dependent field
      handleUpdateModel(firstDependentID, null);

      //Also update API details for dependent field
      const dependentFieldDetails = findFormField(firstDependentID);
      const updatedDependentFieldDetails = getUpdatedCascadingDropdownField(dependentFieldDetails, {
        ...actionFormModel,
        [id]: value
      });

      const dependentFieldGroup = getFormFieldGroup(firstDependentID);
      const updatedDependentFieldGroup = {
        ...formFields[dependentFieldGroup],
        [firstDependentID]: updatedDependentFieldDetails
      };
      setFormFields((formFields) => ({
        ...formFields,
        [dependentFieldGroup]: updatedDependentFieldGroup
      }));
    }
  };

  const handleUpdateModel = (id, value) => {
    setActionFormModel((prevFormModel) => ({
      ...prevFormModel,
      [id]: value
    }));
    checkDependentFields(id, value);
  };

  const getUpdatedCascadingDropdownField = (field, formModel) => {
    const { api_details = {} } = field;
    const { param_value, ...restDetails } = api_details;

    const isParentValueAvailable =
      Object.prototype.hasOwnProperty.call(api_details, 'parent_element') &&
      formModel[api_details.parent_element];
    if (isParentValueAvailable) {
      return {
        ...field,
        api_details: {
          ...restDetails,
          param_value: isParentValueAvailable
        }
      };
    }

    return {
      ...field,
      api_details: restDetails
    };
  };

  const handleGetActionDetails = (formData) => {
    dispatch(getActionDetails(formData)).then((data) => {
      if (data?.payload?.status === 1) {
        const rawFormModel = data?.payload?.data;
        updateCascadingDropdownFormFields(rawFormModel);
        setActionFormModel(rawFormModel);
      }
    });
  };

  const updateCascadingDropdownFormFields = (formModel) => {
    const formFieldGroups = Object.keys(formFields);
    const updatedFormFields = formFieldGroups.reduce((acc, cur) => {
      const fieldMapping = formFields[cur];
      acc[cur] = Object.keys(fieldMapping).reduce((facc, fieldKey) => {
        const field = fieldMapping[fieldKey];
        facc[fieldKey] = getUpdatedCascadingDropdownField(field, formModel);
        return facc;
      }, {});
      return acc;
    }, {});

    setFormFields((formFields) => ({ ...formFields, ...updatedFormFields }));
  };

  const handleActionForm = (formData) => {
    dispatch(submitActionForm(formData)).then((data) => {
      if (data?.payload?.status === 1) {
        showSuccessMsg(data?.payload?.messages);
        setTimeout(() => {
          handleFetchActionList();
          handleCloseDrawer();
        }, 3000);
      } else {
        showErrorMsg(data?.payload ?? data?.payload?.messages);
      }
    });
  };

  const handleSubmitActionData = () => {
    if (isObject(selectedAction) || shouldCreateNewAction) {
      const { action_id = '', action_table: module_string_id = 'hs_action' } = selectedAction || {};
      const formData = { ...actionFormModel, action_id, module_string_id };
      handleActionForm(formData);
    }
  };

  useEffect(() => {
    if (isObject(selectedAction) && !isEmpty(selectedAction)) {
      const { id: dashboard_action_id, action_table, action_id } = selectedAction;
      const formData = { dashboard_action_id, action_table, action_id };
      handleGetActionDetails(formData);
    }
  }, [selectedAction]);

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleCloseDrawer}
      PaperProps={drawerStyleAttrs[viewType] || {}}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t(drawerTitle)}
          </Typography>
          <IconButton edge="end" onClick={handleCloseDrawer} aria-label="close">
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Suspense fallback={<div>{t('loading')}</div>}>
        {viewType === 'view_comment' ? (
          <ActionsComments actionDetails={selectedAction} />
        ) : viewType === 'view_action' ? (
          <ActionsDetails
            isFetching={actionDetailsLoading}
            formFields={formFields}
            formTabItems={formTabItems}
            formModel={actionFormModel}
            onUpdateModel={handleUpdateModel}
            onSubmit={handleSubmitActionData}
            onCancel={handleCloseDrawer}
          />
        ) : (
          ''
        )}
      </Suspense>
    </Drawer>
  );
}
