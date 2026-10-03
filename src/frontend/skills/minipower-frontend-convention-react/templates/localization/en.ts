// Đích: src/features/{feature}/localization/en.ts — cùng shape với vi.ts (kiểu {Feature}Messages).
import type { {Feature}Messages } from './vi'

export const enMessages: {Feature}Messages = {
  menu: {
    list: '{LabelEn}',
  },
  routes: {
    list: '{LabelEn} list',
    create: 'Create {labelEn}',
    detail: '{LabelEn} detail',
    edit: 'Edit {labelEn}',
  },
  fields: {
    code: 'Code',
    name: 'Name',
    description: 'Description',
    status: 'Status',
    createdAt: 'Created at',
    updatedAt: 'Updated at',
    actions: 'Actions',
  },
  placeholders: {
    code: 'e.g. A001',
    name: 'Enter name',
    description: 'Short description…',
    status: 'Select status',
  },
  list: {
    description: 'Manage {labelEn} records.',
    searchPlaceholder: 'Search by code or name…',
    statusAll: 'All statuses',
    create: 'Create',
    empty: 'No data',
    loading: 'Loading…',
    loadError: 'Could not load the list. Please try again.',
    deleteSuccess: '{LabelEn} deleted',
    deleteError: 'Could not delete. Please try again.',
  },
  form: {
    createTitle: 'Create {labelEn}',
    editTitle: 'Edit {labelEn}',
    viewTitle: '{LabelEn} detail',
    createDescription: 'Enter the new {labelEn} information.',
    editDescription: 'Update the {labelEn} information.',
    createSubmit: 'Create',
    editSubmit: 'Save changes',
    cancel: 'Cancel',
    submitting: 'Saving…',
    loading: 'Loading…',
    saveSuccess: '{LabelEn} created',
    updateSuccess: '{LabelEn} updated',
    saveError: 'Could not save. Please try again.',
    loadError: 'Could not load data. Please try again.',
  },
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    toggleStatus: 'Toggle status',
  },
  status: {
    activated: '{LabelEn} activated',
    deactivated: '{LabelEn} deactivated',
    toggleError: 'Could not change status. Please try again.',
  },
  confirmDelete: {
    title: 'Delete {labelEn}?',
    description: (code: string) => `Record "${code}" will be removed from the list.`,
    confirm: 'Delete',
  },
}
