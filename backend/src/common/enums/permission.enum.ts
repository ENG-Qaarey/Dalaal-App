export enum Permission {
  // ── User Management ──
  USER_VIEW = 'user:view',
  USER_LIST = 'user:list',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_SUSPEND = 'user:suspend',
  USER_BAN = 'user:ban',
  USER_RESTORE = 'user:restore',
  USER_CHANGE_ROLE = 'user:change_role',

  // ── Profile ──
  PROFILE_VIEW_OWN = 'profile:view_own',
  PROFILE_EDIT_OWN = 'profile:edit_own',
  PROFILE_VIEW_ANY = 'profile:view_any',

  // ── Listings ──
  LISTING_VIEW = 'listing:view',
  LISTING_CREATE = 'listing:create',
  LISTING_EDIT_OWN = 'listing:edit_own',
  LISTING_DELETE_OWN = 'listing:delete_own',
  LISTING_FEATURE = 'listing:feature',
  LISTING_ARCHIVE_OWN = 'listing:archive_own',

  // ── Admin Moderation ──
  LISTING_APPROVE = 'listing:approve',
  LISTING_REJECT = 'listing:reject',
  LISTING_VIEW_ALL = 'listing:view_all',

  // ── Property Listings ──
  PROPERTY_CREATE = 'property:create',
  PROPERTY_EDIT_OWN = 'property:edit_own',
  PROPERTY_DELETE_OWN = 'property:delete_own',

  // ── Vehicle Listings ──
  VEHICLE_CREATE = 'vehicle:create',
  VEHICLE_EDIT_OWN = 'vehicle:edit_own',
  VEHICLE_DELETE_OWN = 'vehicle:delete_own',

  // ── Payments ──
  PAYMENT_CREATE = 'payment:create',
  PAYMENT_VIEW_OWN = 'payment:view_own',
  PAYMENT_VERIFY = 'payment:verify',
  PAYMENT_VIEW_ALL = 'payment:view_all',

  // ── Escrow ──
  ESCROW_CREATE = 'escrow:create',
  ESCROW_VIEW_OWN = 'escrow:view_own',
  ESCROW_RELEASE = 'escrow:release',
  ESCROW_DISPUTE = 'escrow:dispute',
  ESCROW_VIEW_ALL = 'escrow:view_all',

  // ── Chat & Messages ──
  CHAT_USE = 'chat:use',
  MESSAGE_SEND = 'message:send',
  MESSAGE_DELETE_OWN = 'message:delete_own',
  MESSAGE_DELETE_ANY = 'message:delete_any',

  // ── Notifications ──
  NOTIFICATION_VIEW_OWN = 'notification:view_own',
  NOTIFICATION_MANAGE = 'notification:manage',
  NOTIFICATION_SEND_BROADCAST = 'notification:send_broadcast',

  // ── Reviews ──
  REVIEW_CREATE = 'review:create',
  REVIEW_VIEW = 'review:view',
  REVIEW_DELETE_OWN = 'review:delete_own',
  REVIEW_MANAGE = 'review:manage',
  REVIEW_RESPOND = 'review:respond',

  // ── Verification ──
  VERIFICATION_SUBMIT = 'verification:submit',
  VERIFICATION_VIEW_OWN = 'verification:view_own',
  VERIFICATION_VIEW_ALL = 'verification:view_all',
  VERIFICATION_APPROVE = 'verification:approve',
  VERIFICATION_REJECT = 'verification:reject',

  // ── Admin ──
  ADMIN_DASHBOARD = 'admin:dashboard',
  ADMIN_ANALYTICS = 'admin:analytics',
  ADMIN_SETTINGS = 'admin:settings',
  ADMIN_ANNOUNCEMENTS = 'admin:announcements',
  ADMIN_AUDIT_LOG = 'admin:audit_log',

  // ── Reports ──
  REPORT_SUBMIT = 'report:submit',
  REPORT_VIEW_ALL = 'report:view_all',
  REPORT_RESOLVE = 'report:resolve',

  // ── Search ──
  SEARCH_USE = 'search:use',
  SEARCH_SAVED = 'search:saved',

  // ── Uploads ──
  UPLOAD_IMAGE = 'upload:image',
  UPLOAD_DOCUMENT = 'upload:document',

  // ── Favorites ──
  FAVORITE_ADD = 'favorite:add',
  FAVORITE_REMOVE = 'favorite:remove',
  FAVORITE_VIEW_OWN = 'favorite:view_own',

  // ── Agents ──
  AGENT_STATS_OWN = 'agent:stats_own',
  AGENT_LEADS_OWN = 'agent:leads_own',
  AGENT_LISTINGS_OWN = 'agent:listings_own',
}
