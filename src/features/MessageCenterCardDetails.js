import ArchiveIcon from '@mui/icons-material/Archive';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FormDrawer from '../components/FormDrawer';
import { useLanguage } from '../providers/languageProvider';
import { fetchMessageFormFields } from '../stores/messages/fetchMessageFormFieldsSlice';
import { submitMessageData } from '../stores/messages/submitMessageDataSlice';
import { isBase64ImageData, stringAvatar } from '../utils/others';

function MessageCenterCardDetails({ messageDetails, toggleImportant }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const base64FieldIds = useRef([]);
  const [formFields, setFormFields] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const { form_code = null, form_title = null, is_important, extra_params = {} } = messageDetails;

  const user = useSelector((state) => state.globalData.userDetails);

  const defaultFormModel = {
    master_record_id: '',
    master_table_name: '',
    extra_params,
    additionalData: []
  };

  const handleFetchMessageFormFields = (formCode) => {
    const formData = new FormData();
    formData.append('form_code', formCode);
    dispatch(fetchMessageFormFields(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const formFields = getFormBuilderInputFields(data.data) ?? [];
        setFormFields(formFields);

        base64FieldIds.current = formFields
          .filter((field) => field.type === 'file')
          .map((field) => field.id);
      }
    });
  };

  useEffect(() => {
    if (form_code && isDialogOpen && formFields.length === 0) {
      // fetchFormFields(form_code);
      handleFetchMessageFormFields(form_code);
    }
  }, [form_code, isDialogOpen, formFields]);

  useEffect(() => {
    // Reset form fields to empty array when form_code changes
    if (form_code) {
      setFormFields([]);
    }
  }, [form_code]);

  const getFormBuilderInputFields = (fields) => {
    return fields.map((field) => {
      // Use the language state to select either English or Spanish label
      const labelKey = language === 'en' ? 'label_en' : 'label_es';
      const { id, [labelKey]: label, control_type: type, is_require: required, options } = field;

      let formFieldInfo = {
        id,
        label,
        type,
        required: Boolean(required)
      };

      let updatedOptions = [];
      if (type === 'dropdown') {
        updatedOptions = options.split(',').map((opt) => ({ value: opt, label: opt }));
        formFieldInfo.options = updatedOptions;
      }

      return formFieldInfo;
    });
  };

  const prepareFormData = (formValues) => {
    let formData = {
      ...defaultFormModel,
      unique_filled_form_id: `${user.id_administradores}${+new Date()}`,
      cf: formValues
    };

    const base64FieldWithValues = base64FieldIds.current.filter((fieldId) =>
      isBase64ImageData(formValues[fieldId])
    );
    if (base64FieldWithValues.length) {
      formData['base_64'] = base64FieldWithValues.reduce(
        (acc, cur) => ({ ...acc, [cur]: cur }),
        {}
      );
    }

    return formData;
  };

  const handleSubmitFormData = (formValues, successCallback) => {
    const formData = prepareFormData(formValues);
    dispatch(submitMessageData(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') successCallback();
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const singleNotificationMessageKey =
    language === 'en' ? 'subject_message_en' : 'subject_message_es';
  const singleNotificationDescriptionKey =
    language === 'en' ? 'text_message_en' : 'text_message_es';

  const avatarCommonStyle = { width: 24, height: 24 };
  const whoSentAvatarProps = stringAvatar(messageDetails.who_sent_name, {
    ...avatarCommonStyle,
    bgcolor: 'primary.main'
  });

  return (
    <Fragment>
      <Box
        sx={{
          minHeight: '100%',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '10px',
          p: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h5" sx={{ width: '90%' }}>
            {messageDetails[singleNotificationMessageKey]}
          </Typography>
          <Box sx={{ ml: 3, display: 'flex' }}>
            <IconButton
              size="small"
              color={is_important === '0' ? 'default' : 'primary'}
              onClick={() => toggleImportant(messageDetails.id_message, is_important === '0')}
            >
              <FlagIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick} size="small" sx={{ ml: 1 }}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <ArchiveIcon fontSize="small" /> {t('archive_message')}
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
          <Avatar {...whoSentAvatarProps} />
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              {messageDetails.who_sent_name}
            </Typography>

            {messageDetails.who_sent_email && (
              <Typography>{messageDetails.who_sent_email}</Typography>
            )}
          </Box>

          {messageDetails.user_names && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', mr: '4px' }}
              >
                {t('subscribers')}
              </Typography>
              <AvatarGroup max={4}>
                {messageDetails.user_names.split(',').map((userName, idx) => {
                  const avatarProps = stringAvatar(userName, {
                    ...avatarCommonStyle,
                    fontSize: '0.8rem'
                  });
                  return <Avatar key={idx} {...avatarProps} />;
                })}
              </AvatarGroup>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid #ccc', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">
              {messageDetails[singleNotificationDescriptionKey]}
            </Typography>

            {form_code && form_title && (
              <Button
                size="small"
                variant="contained"
                sx={{ backgroundColor: '#ff0066', color: '#fff', mt: 2, fontWeight: 'normal' }}
                onClick={handleDialogOpen}
              >
                {form_title}
              </Button>
            )}
          </Box>
        </Box>
        {/* Adding a footer */}
        <Box sx={{ p: 2, backgroundColor: 'blue2.main', textAlign: 'center' }}></Box>
      </Box>

      {form_code && form_title && (
        <FormDrawer
          title={form_title}
          open={isDialogOpen}
          submitForm={handleSubmitFormData}
          handleClose={handleDialogClose}
          inputFields={formFields}
        />
      )}
    </Fragment>
  );
}

export default MessageCenterCardDetails;
