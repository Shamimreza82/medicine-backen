export const ROLE_MESSAGES = {
  // Success
  GET_ALL_ROLES: 'Roles retrieved successfully',
  GET_SINGLE_ROLE: 'Role retrieved successfully',
  CREATED: 'Role created successfully',
  UPDATED: 'Role updated successfully',
  DELETED: 'Role deleted successfully',

  // Error
  NOT_FOUND: 'Role not found',
  ALREADY_EXISTS: 'Role already exists',
  INVALID_SLUG: 'Invalid role slug format',
  SYSTEM_ROLE_CANNOT_DELETE: 'System role cannot be deleted',
  SYSTEM_ROLE_CANNOT_UPDATE: 'System role cannot be modified',

  // Validation
  INVALID_ROLE_ID: 'Invalid role id',
  TENANT_REQUIRED: 'Tenant id is required',
};
