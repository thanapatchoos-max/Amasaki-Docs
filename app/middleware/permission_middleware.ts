import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Permission Middleware
 * Guards routes based on the user's Role permissions JSON.
 * Usage in routes: .use(middleware.permission(['module', 'action']))
 * Admin role always bypasses all checks.
 */
export default class PermissionMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: [string, string]
  ) {
    const { auth, response, session } = ctx
    const user = auth.user

    if (!user) {
      return response.redirect('/login')
    }

    // Admin always has full access � bypass all checks
    if (user.isAdmin) {
      return next()
    }

    const [module, action] = options

    // Load role if not already loaded
    await user.load('role')
    const permissions = user.role?.permissions as Record<string, string[]> | null | undefined

    if (!permissions) {
      session.flash('error', 'คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันใดๆ ในระบบ')
      return response.redirect('/login')
    }

    const modulePerms: string[] = permissions[module] || []

    if (!modulePerms.includes(action)) {
      // Prevent infinite redirect loops on login or back()
      session.flash('error', `คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้`)
      
      const urlMap: Record<string, string> = {
        dashboard: '/',
        folders: '/folders',
        documents: '/documents',
        trash: '/trash',
        reports: '/reports',
        users: '/admin/users',
        roles: '/admin/roles',
        audit_logs: '/admin/audit-logs'
      }

      // Find first module they have 'view' permission for
      const firstAvailable = Object.keys(permissions).find(k => permissions[k] && permissions[k].includes('view'))
      
      if (firstAvailable && urlMap[firstAvailable] && ctx.request.url() !== urlMap[firstAvailable]) {
        return response.redirect(urlMap[firstAvailable])
      }
      
      return response.unauthorized('Access Denied: คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
    }

    return next()
  }
}
