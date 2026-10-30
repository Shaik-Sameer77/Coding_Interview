import React from 'react';

// Category 1
import {
  DemoModalDialog, DemoClickOutside, DemoAccessibleTabs, DemoAccordion,
  DemoTooltip, DemoDrawer, DemoPopover, DemoContextMenu, DemoFlyoutMenu, DemoSpeedDial
} from './category1_overlays';

// Category 2
import {
  DemoOtpInput, DemoMultiStepForm, DemoDynamicForm, DemoAutocomplete,
  DemoTagInput, DemoPasswordStrength, DemoFormValidation, DemoInlineEditable,
  DemoCardCurrencyFormatter, DemoFileUpload
} from './category2_forms';

// Category 3
import {
  DemoChronaBatchQueue, DemoOptimisticRollback, DemoConflictResolution,
  DemoLesHubAuditLog, DemoRbacPermissionGate, DemoInvoiceCalculator,
  DemoAppointmentBooking, DemoOfflineSyncQueue, DemoRequestDeduplication, DemoToastNotification
} from './category3_enterprise';

// Category 4
import {
  DemoDataTable, DemoEditableDataGrid, DemoInfiniteScroll, DemoVirtualizedList,
  DemoTreeView, DemoFileExplorer, DemoJsonDiff, DemoGroupByUtility,
  DemoHorizontalScrollMenu, DemoStickyTable
} from './category4_grids_tables';

// Category 5
import {
  DemoKanbanBoard, DemoResizablePanels, DemoUndoRedo, DemoStarRating,
  DemoCarousel, DemoSequentialProgress, DemoBreadcrumbs, DemoTransferList,
  DemoThemeSwitcher, DemoBranchingStepper
} from './category5_systems_visuals';

// Category 6
import {
  DemoUseDebounce, DemoUseThrottle, DemoUsePrevious, DemoUseClickOutside,
  DemoUseLocalStorage, DemoUseIntersectionObserver, DemoUseAsyncRetry,
  DemoUseMediaQuery, DemoUseIdleTimer, DemoWhyDidYouUpdate, DemoUseCountdown,
  DemoUseWindowSize, DemoUseCopyToClipboard, DemoUseUndoRedoHook, DemoUseEventCallback
} from './category6_custom_hooks';

// Category 7
import {
  DemoPromiseAll, DemoPromiseAllSettled, DemoPromiseRaceAny, DemoDeepClone,
  DemoDeepEqual, DemoFlatArray, DemoFlattenObject, DemoKeyBy, DemoEventEmitter, DemoLruCache
} from './category7_polyfills_utils';

// Category 8
import {
  DemoSwrCache, DemoPollingBackoff, DemoLiveTicker, DemoRequestDeduplicationMini,
  DemoRaceConditionGuard, DemoChunkedUpload, DemoCursorPagination,
  DemoBroadcastChannel, DemoWebWorkerOffloader, DemoTokenBucket
} from './category8_async_network';

// Category 9
import {
  DemoSkeletonLoader, DemoMediaPlayer, DemoImageCropper, DemoColorPicker,
  DemoFlipCard, DemoQrCode, DemoTicTacToe
} from './category9_media_mini_apps';

// Category 10
import {
  DemoFocusManagement, DemoAutosaveGuard, DemoMultiTenantSwitcher,
  DemoFeatureFlagProvider, DemoBulkHourEntry, DemoPasswordlessLogin,
  DemoApiEncryption, DemoMemoryLeakAudit
} from './category10_security_perf';

export const DEMO_REGISTRY = {
  // Category 1
  DemoModalDialog, DemoClickOutside, DemoAccessibleTabs, DemoAccordion,
  DemoTooltip, DemoDrawer, DemoPopover, DemoContextMenu, DemoFlyoutMenu, DemoSpeedDial,

  // Category 2
  DemoOtpInput, DemoMultiStepForm, DemoDynamicForm, DemoAutocomplete,
  DemoTagInput, DemoPasswordStrength, DemoFormValidation, DemoInlineEditable,
  DemoCardCurrencyFormatter, DemoFileUpload,

  // Category 3
  DemoChronaBatchQueue, DemoOptimisticRollback, DemoConflictResolution,
  DemoLesHubAuditLog, DemoRbacPermissionGate, DemoInvoiceCalculator,
  DemoAppointmentBooking, DemoOfflineSyncQueue, DemoRequestDeduplication, DemoToastNotification,

  // Category 4
  DemoDataTable, DemoEditableDataGrid, DemoInfiniteScroll, DemoVirtualizedList,
  DemoTreeView, DemoFileExplorer, DemoJsonDiff, DemoGroupByUtility,
  DemoHorizontalScrollMenu, DemoStickyTable,

  // Category 5
  DemoKanbanBoard, DemoResizablePanels, DemoUndoRedo, DemoStarRating,
  DemoCarousel, DemoSequentialProgress, DemoBreadcrumbs, DemoTransferList,
  DemoThemeSwitcher, DemoBranchingStepper,

  // Category 6
  DemoUseDebounce, DemoUseThrottle, DemoUsePrevious, DemoUseClickOutside,
  DemoUseLocalStorage, DemoUseIntersectionObserver, DemoUseAsyncRetry,
  DemoUseMediaQuery, DemoUseIdleTimer, DemoWhyDidYouUpdate, DemoUseCountdown,
  DemoUseWindowSize, DemoUseCopyToClipboard, DemoUseUndoRedoHook, DemoUseEventCallback,

  // Category 7
  DemoPromiseAll, DemoPromiseAllSettled, DemoPromiseRaceAny, DemoDeepClone,
  DemoDeepEqual, DemoFlatArray, DemoFlattenObject, DemoKeyBy, DemoEventEmitter, DemoLruCache,

  // Category 8
  DemoSwrCache, DemoPollingBackoff, DemoLiveTicker, DemoRequestDeduplicationMini,
  DemoRaceConditionGuard, DemoChunkedUpload, DemoCursorPagination,
  DemoBroadcastChannel, DemoWebWorkerOffloader, DemoTokenBucket,

  // Category 9
  DemoSkeletonLoader, DemoMediaPlayer, DemoImageCropper, DemoColorPicker,
  DemoFlipCard, DemoQrCode, DemoTicTacToe,

  // Category 10
  DemoFocusManagement, DemoAutosaveGuard, DemoMultiTenantSwitcher,
  DemoFeatureFlagProvider, DemoBulkHourEntry, DemoPasswordlessLogin,
  DemoApiEncryption, DemoMemoryLeakAudit
};
