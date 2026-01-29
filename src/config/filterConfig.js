//import { useTranslation } from 'react-i18next';
//const { t } = useTranslation();
import i18n from 'i18next';

const textSearchField = {
  labelKey: 'Keywords',
  type: 'text-search-field',
  name: 'filter_keywords',
  default_value: '',
  group_by_key: 'search_by',
  group_by_label: 'SearchBy',
  fieldStyle: {
    width: '100%',
    borderRadius: '5px'
  }
};

const dateRangeField = {
  labelKey: '',
  type: 'date-range',
  name: ['filter_start_date', 'filter_end_date'],
  default_value: null,
  group_by_key: 'date',
  group_by_label: 'DateRange',
  fieldAttrs: {
    direction: 'column'
  }
};

const dropdownAdminList = {
  type: 'autocomplete',
  name: 'filter_sender',
  default_value: '',
  options: [],
  storageType: 'global',
  storageKey: 'listOfUsers',
  group_by_key: 'filter_by',
  group_by_label: 'FilterBy'
};

const dropdownReviewerList = {
  type: 'autocomplete',
  name: 'filter_reviewer',
  default_value: '',
  options: [],
  storageType: 'global',
  storageKey: 'listOfUsers',
  group_by_key: 'filter_by',
  group_by_label: 'FilterBy'
};

export const filterConfigs = {
  legalMatrix: [
    textSearchField,
    /*
    {
      labelKey: 'type_of_rule',
      type: 'autocompleteWithoutLevel',
      name: 'filter_type_rule',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/message_center_api/legal_api/list_noram_tipo_requisito'
      },
      
    },
    */
   /*
    {
      labelKey: 'Category',
      type: 'autocompleteWithoutLevel',
      name: 'filter_category',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/message_center_api/legal_api/list_legal_categories'
      },
    },
    */
    {
      labelKey: 'Date_field',
      type: 'autocompleteWithoutLevel',
      name: 'filter_nameDateField',
      default_value: '',
      //options: [],
      options: [
        { value: 'date_of_issue_notification', label: 'date_of_issue_notification' },
        { value: 'effective_date', label: 'effective_date' },
        { value: 'renovation_date', label: 'renovation_date' },
        { value: 'modified_date', label: 'modified_date' }
      ],
      api_details: {}
    },
    {
      labelKey: 'Range_date',
      type: 'date-range',
      name: ['filter_start_date', 'filter_end_date'],
      default_value: null,
      fieldAttrs: {
        direction: 'column'
      },
      group_by_key: 'date',
      group_by_label: 'DateRange'
    }
  ],
  notifications: [
    textSearchField,
    /*
    {
      labelKey: 'Status',
      type: 'autocomplete',
      name: 'filter_status',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_dashboard_message_status'
      },
      group_by_key: 'filter_by',
      group_by_label: 'FilterBy'
    },
    {
      ...dropdownAdminList,
      labelKey: 'Sender'
    },
    {
      labelKey: 'Category',
      type: 'autocomplete',
      name: 'filter_module_string',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_message_category_modules'
      },
      group_by_key: 'filter_by',
      group_by_label: 'FilterBy'
    },
    */
    dateRangeField
  ],
  events: [
    textSearchField,
    // Configuration for events filters
    
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Executor'
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Reviewer'
    },
    {
      labelKey: 'Etiquetas',
      type: 'autocompleteWithoutLevel',
      name: 'Etiquetas',
      default_value: '',
      //options: [],
      options: [
        { value: '1', label: 'Gestión ambiental' },
        { value: '2', label: 'Gestión de permisos' },
        { value: '3', label: 'Gestión social' },
        { value: '4', label: 'Gestión PMA' }
      ],
      api_details: {}
    },
    
    dateRangeField
  ],
  events_table: [
    textSearchField,
    // Configuration for events filters
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Executor'
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Reviewer'
    },
    dateRangeField
  ],
  events_list: [
    textSearchField,
    // Configuration for events filters
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Executor'
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Reviewer'
    }
    //dateRangeField,
  ],
  /*
  ,
  events: [
    textSearchField,
    // Configuration for events filters
    {
      labelKey: 'Status',
      type: 'autocomplete',
      name: 'filter_status',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_task_status'
      }
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Reviewer'
    },
    dateRangeField,
    {
      labelKey: 'Negocio',
      type: 'autocomplete',
      name: 'filter_business',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_level1'
      },
      level: 1
    },
    {
      labelKey: 'Compañía',
      type: 'autocomplete',
      name: 'filter_company',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/get_level2 '
      },
      level: 2
    },
    {
      labelKey: 'Región',
      type: 'autocomplete',
      name: 'filter_region',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_level1'
      },
      level: 1
    },
    {
      labelKey: 'Localidad',
      type: 'autocomplete',
      name: 'filter_location',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    }
  ],
  */
  findings: [
    textSearchField,
    {
      labelKey: 'country',
      type: 'autocomplete',
      name: 'filter_country',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'company',
      type: 'autocomplete',
      name: 'filter_company',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'department',
      type: 'autocomplete',
      name: 'filter_department',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'city',
      type: 'autocomplete',
      name: 'filter_city',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'management',
      type: 'autocomplete',
      name: 'filter_management',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'Contractor',
      type: 'autocomplete',
      name: 'filter_Contractor',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'person_registering',
      type: 'autocomplete',
      name: 'filter_person_registering',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    dateRangeField,
    {
      labelKey: 'Status',
      type: 'autocomplete',
      name: 'filter_Status',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    },
    {
      labelKey: 'source_of_the_finding',
      type: 'autocomplete',
      name: 'filter_source_of_the_finding',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/tasklist_api/tasklist_api/list_location'
      }
    }
  ],
  actions: [
    textSearchField,
    // Configuration for actions filters
    {
      labelKey: 'Status',
      type: 'autocompleteWithoutLevel',
      name: 'filter_status',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/message_center_api/action_api/dashboard_actions_status'
      }
    },
    {
      labelKey: 'Category',
      type: 'autocompleteWithoutLevel',
      name: 'filter_module_string',
      default_value: '',
      options: [],
      api_details: {
        api_url: '/message_center_api/action_api/list_action_categories'
      }
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Executor'
    },
    {
      // TODO: Both dropdowns are the same. I need to individually fetch the options for each dropdown.
      ...dropdownReviewerList,
      labelKey: 'Reviewer'
    },
    dateRangeField
  ]
};
