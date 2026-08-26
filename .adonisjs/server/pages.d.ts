import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    '(auth)/forgot-password/page': ExtractProps<(typeof import('../../inertia/pages/(auth)/forgot-password/page.tsx'))['default']>
    '(auth)/layout': ExtractProps<(typeof import('../../inertia/pages/(auth)/layout.tsx'))['default']>
    '(auth)/login/page': ExtractProps<(typeof import('../../inertia/pages/(auth)/login/page.tsx'))['default']>
    '(auth)/reset-password/page': ExtractProps<(typeof import('../../inertia/pages/(auth)/reset-password/page.tsx'))['default']>
    '(auth)/reset-password/ResetPasswordForm': ExtractProps<(typeof import('../../inertia/pages/(auth)/reset-password/ResetPasswordForm.tsx'))['default']>
    '(main)/admin/[...slug]/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/[...slug]/page.tsx'))['default']>
    '(main)/admin/audit-logs/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/audit-logs/page.tsx'))['default']>
    '(main)/admin/config/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/config/page.tsx'))['default']>
    '(main)/admin/config/roles/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/config/roles/page.tsx'))['default']>
    '(main)/admin/config/users/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/config/users/page.tsx'))['default']>
    '(main)/admin/layout': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/layout.tsx'))['default']>
    '(main)/admin/master-data/doc-forms/ApprovalMatrixTab': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/doc-forms/ApprovalMatrixTab.tsx'))['default']>
    '(main)/admin/master-data/doc-forms/DocumentTypesTab': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/doc-forms/DocumentTypesTab.tsx'))['default']>
    '(main)/admin/master-data/doc-forms/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/doc-forms/page.tsx'))['default']>
    '(main)/admin/master-data/DocumentRunningTab': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/DocumentRunningTab.tsx'))['default']>
    '(main)/admin/master-data/master-data-ui': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/master-data-ui.tsx'))['default']>
    '(main)/admin/master-data/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/page.tsx'))['default']>
    '(main)/admin/master-data/WorkflowTab': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/master-data/WorkflowTab.tsx'))['default']>
    '(main)/admin/reports/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/reports/page.tsx'))['default']>
    '(main)/admin/users/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/users/page.tsx'))['default']>
    '(main)/approvals/[id]/page': ExtractProps<(typeof import('../../inertia/pages/(main)/approvals/[id]/page.tsx'))['default']>
    '(main)/approvals/history/page': ExtractProps<(typeof import('../../inertia/pages/(main)/approvals/history/page.tsx'))['default']>
    '(main)/approvals/page': ExtractProps<(typeof import('../../inertia/pages/(main)/approvals/page.tsx'))['default']>
    '(main)/dashboard/page': ExtractProps<(typeof import('../../inertia/pages/(main)/dashboard/page.tsx'))['default']>
    '(main)/documents/[id]/page': ExtractProps<(typeof import('../../inertia/pages/(main)/documents/[id]/page.tsx'))['default']>
    '(main)/documents/[id]/versions/page': ExtractProps<(typeof import('../../inertia/pages/(main)/documents/[id]/versions/page.tsx'))['default']>
    '(main)/documents/page': ExtractProps<(typeof import('../../inertia/pages/(main)/documents/page.tsx'))['default']>
    '(main)/documents/upload/page': ExtractProps<(typeof import('../../inertia/pages/(main)/documents/upload/page.tsx'))['default']>
    '(main)/folders/[id]/page': ExtractProps<(typeof import('../../inertia/pages/(main)/folders/[id]/page.tsx'))['default']>
    '(main)/folders/page': ExtractProps<(typeof import('../../inertia/pages/(main)/folders/page.tsx'))['default']>
    '(main)/layout': ExtractProps<(typeof import('../../inertia/pages/(main)/layout.tsx'))['default']>
    '(main)/notifications/page': ExtractProps<(typeof import('../../inertia/pages/(main)/notifications/page.tsx'))['default']>
    '(main)/profile/page': ExtractProps<(typeof import('../../inertia/pages/(main)/profile/page.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'layout': ExtractProps<(typeof import('../../inertia/pages/layout.tsx'))['default']>
    'page': ExtractProps<(typeof import('../../inertia/pages/page.tsx'))['default']>
    '(main)/admin/roles/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/roles/page.tsx'))['default']>
    '(main)/documents/expiring/page': ExtractProps<(typeof import('../../inertia/pages/(main)/documents/expiring/page.tsx'))['default']>
    '(main)/admin/roles/RoleForm': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/roles/RoleForm.tsx'))['default']>
    '(main)/admin/roles/create/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/roles/create/page.tsx'))['default']>
    '(main)/admin/roles/edit/page': ExtractProps<(typeof import('../../inertia/pages/(main)/admin/roles/edit/page.tsx'))['default']>
    '(main)/reports/page': ExtractProps<(typeof import('../../inertia/pages/(main)/reports/page.tsx'))['default']>
  }
}
