import { PrismaClient, UserRole } from '@prisma/client';
import { Permission } from '../src/common/enums/permission.enum';

const prisma = new PrismaClient();

// ── Permission groups for readability ──

// Customer: browse, buy, chat, review, favorites
const CUSTOMER_PERMS = [
  Permission.USER_VIEW,
  Permission.USER_LIST,
  Permission.PROFILE_VIEW_OWN,
  Permission.PROFILE_EDIT_OWN,
  Permission.PROFILE_VIEW_ANY,
  Permission.LISTING_VIEW,
  Permission.PAYMENT_CREATE,
  Permission.PAYMENT_VIEW_OWN,
  Permission.ESCROW_CREATE,
  Permission.ESCROW_VIEW_OWN,
  Permission.ESCROW_DISPUTE,
  Permission.CHAT_USE,
  Permission.MESSAGE_SEND,
  Permission.MESSAGE_DELETE_OWN,
  Permission.NOTIFICATION_VIEW_OWN,
  Permission.REVIEW_CREATE,
  Permission.REVIEW_VIEW,
  Permission.REVIEW_DELETE_OWN,
  Permission.VERIFICATION_SUBMIT,
  Permission.VERIFICATION_VIEW_OWN,
  Permission.SEARCH_USE,
  Permission.SEARCH_SAVED,
  Permission.UPLOAD_IMAGE,
  Permission.FAVORITE_ADD,
  Permission.FAVORITE_REMOVE,
  Permission.FAVORITE_VIEW_OWN,
  Permission.REPORT_SUBMIT,
];

// Property Owner: all customer + list properties only
const PROPERTY_OWNER_PERMS = [
  ...CUSTOMER_PERMS,
  Permission.LISTING_CREATE,
  Permission.LISTING_EDIT_OWN,
  Permission.LISTING_DELETE_OWN,
  Permission.LISTING_ARCHIVE_OWN,
  Permission.PROPERTY_CREATE,
  Permission.PROPERTY_EDIT_OWN,
  Permission.PROPERTY_DELETE_OWN,
  Permission.UPLOAD_DOCUMENT,
  Permission.AGENT_STATS_OWN,
  Permission.AGENT_LEADS_OWN,
  Permission.AGENT_LISTINGS_OWN,
];

// Vehicle Owner: all customer + list vehicles only
const VEHICLE_OWNER_PERMS = [
  ...CUSTOMER_PERMS,
  Permission.LISTING_CREATE,
  Permission.LISTING_EDIT_OWN,
  Permission.LISTING_DELETE_OWN,
  Permission.LISTING_ARCHIVE_OWN,
  Permission.VEHICLE_CREATE,
  Permission.VEHICLE_EDIT_OWN,
  Permission.VEHICLE_DELETE_OWN,
  Permission.UPLOAD_DOCUMENT,
  Permission.AGENT_STATS_OWN,
  Permission.AGENT_LEADS_OWN,
  Permission.AGENT_LISTINGS_OWN,
];

// Broker (Dalaal): all customer + list both property + vehicle
const BROKER_PERMS = [
  ...CUSTOMER_PERMS,
  Permission.LISTING_CREATE,
  Permission.LISTING_EDIT_OWN,
  Permission.LISTING_DELETE_OWN,
  Permission.LISTING_ARCHIVE_OWN,
  Permission.PROPERTY_CREATE,
  Permission.PROPERTY_EDIT_OWN,
  Permission.PROPERTY_DELETE_OWN,
  Permission.VEHICLE_CREATE,
  Permission.VEHICLE_EDIT_OWN,
  Permission.VEHICLE_DELETE_OWN,
  Permission.UPLOAD_DOCUMENT,
  Permission.ESCROW_RELEASE,
  Permission.AGENT_STATS_OWN,
  Permission.AGENT_LEADS_OWN,
  Permission.AGENT_LISTINGS_OWN,
];

// SUPER_ADMIN: everything
const SUPER_ADMIN_PERMS = Object.values(Permission);

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: SUPER_ADMIN_PERMS,
  [UserRole.BROKER]: BROKER_PERMS,
  [UserRole.PROPERTY_OWNER]: PROPERTY_OWNER_PERMS,
  [UserRole.VEHICLE_OWNER]: VEHICLE_OWNER_PERMS,
  [UserRole.CUSTOMER]: CUSTOMER_PERMS,
};

const PERMISSION_GROUPS: Record<string, string> = {
  [Permission.USER_VIEW]: 'User Management',
  [Permission.USER_LIST]: 'User Management',
  [Permission.USER_CREATE]: 'User Management',
  [Permission.USER_UPDATE]: 'User Management',
  [Permission.USER_DELETE]: 'User Management',
  [Permission.USER_SUSPEND]: 'User Management',
  [Permission.USER_BAN]: 'User Management',
  [Permission.USER_RESTORE]: 'User Management',
  [Permission.USER_CHANGE_ROLE]: 'User Management',

  [Permission.PROFILE_VIEW_OWN]: 'Profile',
  [Permission.PROFILE_EDIT_OWN]: 'Profile',
  [Permission.PROFILE_VIEW_ANY]: 'Profile',

  [Permission.LISTING_VIEW]: 'Listings',
  [Permission.LISTING_CREATE]: 'Listings',
  [Permission.LISTING_EDIT_OWN]: 'Listings',
  [Permission.LISTING_DELETE_OWN]: 'Listings',
  [Permission.LISTING_FEATURE]: 'Listings',
  [Permission.LISTING_ARCHIVE_OWN]: 'Listings',

  [Permission.LISTING_APPROVE]: 'Moderation',
  [Permission.LISTING_REJECT]: 'Moderation',
  [Permission.LISTING_VIEW_ALL]: 'Moderation',

  [Permission.PROPERTY_CREATE]: 'Property',
  [Permission.PROPERTY_EDIT_OWN]: 'Property',
  [Permission.PROPERTY_DELETE_OWN]: 'Property',

  [Permission.VEHICLE_CREATE]: 'Vehicle',
  [Permission.VEHICLE_EDIT_OWN]: 'Vehicle',
  [Permission.VEHICLE_DELETE_OWN]: 'Vehicle',

  [Permission.PAYMENT_CREATE]: 'Payments',
  [Permission.PAYMENT_VIEW_OWN]: 'Payments',
  [Permission.PAYMENT_VERIFY]: 'Payments',
  [Permission.PAYMENT_VIEW_ALL]: 'Payments',

  [Permission.ESCROW_CREATE]: 'Escrow',
  [Permission.ESCROW_VIEW_OWN]: 'Escrow',
  [Permission.ESCROW_RELEASE]: 'Escrow',
  [Permission.ESCROW_DISPUTE]: 'Escrow',
  [Permission.ESCROW_VIEW_ALL]: 'Escrow',

  [Permission.CHAT_USE]: 'Chat',
  [Permission.MESSAGE_SEND]: 'Chat',
  [Permission.MESSAGE_DELETE_OWN]: 'Chat',
  [Permission.MESSAGE_DELETE_ANY]: 'Chat',

  [Permission.NOTIFICATION_VIEW_OWN]: 'Notifications',
  [Permission.NOTIFICATION_MANAGE]: 'Notifications',
  [Permission.NOTIFICATION_SEND_BROADCAST]: 'Notifications',

  [Permission.REVIEW_CREATE]: 'Reviews',
  [Permission.REVIEW_VIEW]: 'Reviews',
  [Permission.REVIEW_DELETE_OWN]: 'Reviews',
  [Permission.REVIEW_MANAGE]: 'Reviews',

  [Permission.VERIFICATION_SUBMIT]: 'Verification',
  [Permission.VERIFICATION_VIEW_OWN]: 'Verification',
  [Permission.VERIFICATION_VIEW_ALL]: 'Verification',
  [Permission.VERIFICATION_APPROVE]: 'Verification',
  [Permission.VERIFICATION_REJECT]: 'Verification',

  [Permission.ADMIN_DASHBOARD]: 'Admin',
  [Permission.ADMIN_ANALYTICS]: 'Admin',
  [Permission.ADMIN_SETTINGS]: 'Admin',
  [Permission.ADMIN_ANNOUNCEMENTS]: 'Admin',
  [Permission.ADMIN_AUDIT_LOG]: 'Admin',

  [Permission.REPORT_SUBMIT]: 'Reports',
  [Permission.REPORT_VIEW_ALL]: 'Reports',
  [Permission.REPORT_RESOLVE]: 'Reports',

  [Permission.SEARCH_USE]: 'Search',
  [Permission.SEARCH_SAVED]: 'Search',

  [Permission.UPLOAD_IMAGE]: 'Uploads',
  [Permission.UPLOAD_DOCUMENT]: 'Uploads',

  [Permission.FAVORITE_ADD]: 'Favorites',
  [Permission.FAVORITE_REMOVE]: 'Favorites',
  [Permission.FAVORITE_VIEW_OWN]: 'Favorites',

  [Permission.AGENT_STATS_OWN]: 'Agents',
  [Permission.AGENT_LEADS_OWN]: 'Agents',
  [Permission.AGENT_LISTINGS_OWN]: 'Agents',
};

async function main() {
  console.log('Seeding permissions...');

  const allPermissions = Object.values(Permission);

  for (const permName of allPermissions) {
    const group = PERMISSION_GROUPS[permName] || 'General';
    const description = `${permName.split(':')[1].replace(/_/g, ' ')} (${permName.split(':')[0]})`;

    await prisma.permission.upsert({
      where: { name: permName },
      update: { group, description },
      create: { name: permName, group, description },
    });
  }

  console.log(`  Seeded ${allPermissions.length} permissions`);

  console.log('Seeding role-permission mappings...');

  for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const uniquePerms = [...new Set(permissions)];

    for (const permName of uniquePerms) {
      const perm = await prisma.permission.findUnique({
        where: { name: permName },
      });

      if (!perm) {
        console.warn(`  Permission not found: ${permName}`);
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: { role: role as UserRole, permissionId: perm.id },
        },
        update: {},
        create: { role: role as UserRole, permissionId: perm.id },
      });
    }

    console.log(
      `  ${role}: ${uniquePerms.length} permissions`,
    );
  }

  console.log('Role-permission seeding complete!');

  const summary = await prisma.rolePermission.groupBy({
    by: ['role'],
    _count: { id: true },
  });

  console.log('\nSummary:');
  for (const s of summary) {
    console.log(`  ${s.role}: ${s._count.id} permissions`);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding permissions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
