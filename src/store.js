// store.js
import { configureStore } from '@reduxjs/toolkit';
import editActionCommentsSlice from './stores/actions/editActionCommentsSlice';
import fetchActionCommentsSlice from './stores/actions/fetchActionCommentsSlice';
import fetchActionFormFieldsSlice from './stores/actions/fetchActionFormFieldsSlice';
import fetchActionFormModelSlice from './stores/actions/fetchActionFormModelSlice';
import fetchActionSlice from './stores/actions/fetchActionSlice';
import fetchTableColumnsSlice from './stores/actions/fetchTableColumnsSlice';
import getActionDetailsSlice from './stores/actions/getActionDetailsSlice';
import getActionLogtaskSlice from './stores/actions/getActionLogtaskSlice';
import submitActionFormSlice from './stores/actions/submitActionFormSlice';
import uploadCommentAttachmentsSlice from './stores/actions/uploadCommentAttachmentsSlice';
import fetchEventsListSlice from './stores/events/fetchEventsListSlice';
import filterReducer from './stores/filterSlice';
import globalDataReducer from './stores/globalDataSlice';
import fetchListGeovisorSlice from './stores/legal/fetchListGeovisorSlice';
import fetchListLegalsSlice from './stores/legal/fetchListLegalsSlice';
import fetchRisksListSlice from './stores/legal/fetchRisksListSlice';
import fetchSubGeovisorSlice from './stores/legal/fetchSubGeovisorSlice';
import getLegalDetailsSlice from './stores/legal/getLegalDetailsSlice';
import getLegalTreeSlice from './stores/legal/getLegalTreeSlice';
import fetchLegalCountsSlice from './stores/legal/fetchLegalCountsSlice';
import fetchArticlesSlice from './stores/legal/fetchArticlesSlice';
import dashboardMessageSlice from './stores/messages/dashboardMessageSlice';
import fetchDashboardMessageDetailsSlice from './stores/messages/fetchDashboardMessageDetailsSlice';
import fetchDashboardMessageStatisticsSlice from './stores/messages/fetchDashboardMessageStatisticsSlice';
import fetchMessageFormFieldsSlice from './stores/messages/fetchMessageFormFieldsSlice';
import submitMessageDataSlice from './stores/messages/submitMessageDataSlice';
import updateMessageSlice from './stores/messages/updateMessageSlice';
import taskDataReducer from './stores/taskDataSlice';
import deleteLogtaskSlice from './stores/tasks/deleteLogtaskSlice';
import fetchAdministratorsListSlice from './stores/tasks/fetchAdministratorsListSlice';
import fetchAlertListSlice from './stores/tasks/fetchAlertListSlice';
import fetchContractorListSlice from './stores/tasks/fetchContractorListSlice';
import fetchConvenioListSlice from './stores/tasks/fetchConvenioListSlice';
import fetchListLevelExecutorSlice from './stores/tasks/fetchListLevelExecutorSlice';
import fetchListTaskNewSlice from './stores/tasks/fetchListTaskNewSlice';
import fetchLogtaskListSlice from './stores/tasks/fetchLogtaskListSlice';
import fetchPhaseSlice from './stores/tasks/fetchPhasesSlice';
import fetchPMASListSlice from './stores/tasks/fetchPMASListSlice';
import fetchProgramAmbientalSlice from './stores/tasks/fetchProgramAmbientalSlice';
import fetchProyectoAmbientalSlice from './stores/tasks/fetchProyectoAmbientalSlice';
import fetchSubPhasesSlice from './stores/tasks/fetchSubPhasesSlice';
import fetchTaskCountsSlice from './stores/tasks/fetchTaskCountsSlice';
import fetchTaskListStatusSlice from './stores/tasks/fetchTaskListStatusSlice';
import fetchTaskListLevelSlice from './stores/tasks/fetchtaskListLevelSlice';
import fetchTaskTagsSlice from './stores/tasks/fetchTaskTagsSlice';
import getLogtaskCommentsSlice from './stores/tasks/getLogtaskCommentsSlice';
import getLogtaskDetailsSlice from './stores/tasks/getLogtaskDetailsSlice';
import getPositionUserListSlice from './stores/tasks/getPositionUserListSlice';
import getProgramsSlice from './stores/tasks/getProgramsSlice';
import getResponsiblesSlice from './stores/tasks/getResponsiblesSlice';
import getSettingsSlice from './stores/tasks/getSettingsSlice';
import getSubProgramsSlice from './stores/tasks/getSubProgramsSlice';
import saveTaskSlice from './stores/tasks/saveTaskSlice';
import updateLogtaskDetailsSlice from './stores/tasks/updateLogtaskDetailsSlice';
import updateResponsiblesSlice from './stores/tasks/updateResponsiblesSlice';
import updateTaskDetailsSlice from './stores/tasks/updateTaskDetialsSlice';
import moduleStatisticsReducer from './stores/moduleStatisticsSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    globalData: globalDataReducer,
    taskData: taskDataReducer,
    moduleStatistics: moduleStatisticsReducer,
    fetchTaskCounts: fetchTaskCountsSlice,
    fetchTaskListStatus: fetchTaskListStatusSlice,
    fetchEventsList: fetchEventsListSlice,
    fetchTaskListLevel: fetchTaskListLevelSlice,
    dashboardMessage: dashboardMessageSlice,
    fetchListTaskNew: fetchListTaskNewSlice,
    fetchLegalCounts: fetchLegalCountsSlice,
    fetchTableColumns: fetchTableColumnsSlice,
    fetchActionFormFields: fetchActionFormFieldsSlice,
    fetchActionFormModel: fetchActionFormModelSlice,
    fetchActionComments: fetchActionCommentsSlice,
    editActionComments: editActionCommentsSlice,
    actionData: fetchActionSlice,
    submitActionForm: submitActionFormSlice,
    getActionDetails: getActionDetailsSlice,
    getActionLogtask: getActionLogtaskSlice,
    fetchLogtaskList: fetchLogtaskListSlice,
    deleteLogtask: deleteLogtaskSlice,
    getLogtaskDetails: getLogtaskDetailsSlice,
    fetchDashboardMessageDetails: fetchDashboardMessageDetailsSlice,
    fetchDashboardMessageStatistics: fetchDashboardMessageStatisticsSlice,
    updateMessage: updateMessageSlice,
    submitMessageData: submitMessageDataSlice,
    fetchMessageFormFields: fetchMessageFormFieldsSlice,
    fetchListLevelExecutor: fetchListLevelExecutorSlice,
    getLegalTree: getLegalTreeSlice,
    fetchSubGeovisor: fetchSubGeovisorSlice,
    fetchListGeovisor: fetchListGeovisorSlice,
    fetchTaskTags: fetchTaskTagsSlice,
    fetchPhase: fetchPhaseSlice,
    fetchSubPhases: fetchSubPhasesSlice,
    fetchPMASList: fetchPMASListSlice,
    getPrograms: getProgramsSlice,
    getSubPrograms: getSubProgramsSlice,
    fetchProyectoAmbiental: fetchProyectoAmbientalSlice,
    fetchProgramAmbiental: fetchProgramAmbientalSlice,
    fetchConvenioList: fetchConvenioListSlice,
    fetchAlertList: fetchAlertListSlice,
    updateTaskDetails: updateTaskDetailsSlice,
    getSettings: getSettingsSlice,
    updateLogtaskDetails: updateLogtaskDetailsSlice,
    updateResponsibles: updateResponsiblesSlice,
    getPositionUserList: getPositionUserListSlice,
    fetchContractorList: fetchContractorListSlice,
    fetchAdministratorsList: fetchAdministratorsListSlice,
    getResponsibles: getResponsiblesSlice,
    getLegalDetails: getLegalDetailsSlice,
    saveTask: saveTaskSlice,
    fetchRisksList: fetchRisksListSlice,
    uploadCommentAttachments: uploadCommentAttachmentsSlice,
    getLogtaskComments: getLogtaskCommentsSlice,
    fetchArticles: fetchArticlesSlice
  }
});

export default store;
