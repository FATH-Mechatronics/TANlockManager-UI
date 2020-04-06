import AuthUser from "../model/AuthUser";
import Permission from "../model/Permission";

const _OR = 'or';
const _AND = 'and';

function _hasPermission(user: AuthUser, permission: string | string[] = Permission.SYSTEM_AUTH, prefixId: string | null = null, logic: string = 'and'): boolean {
  if (user == null) {
    return false;
  }
  if (permission == null || permission.length === 0) {
    permission = Permission.SYSTEM_AUTH;
  }
  let prefix = '';
  if (prefixId != null) {
    prefix = `${prefixId}#`;
  }
  if (Array.isArray(permission)) {
    logic = logic.toLowerCase();
    switch (logic) {
      case _OR:
        for (let k in permission) {
          if (user.hasPermission(prefix + permission[k])) {
            return true;
          }
        }
        return false;
      case _AND:
        for (let k in permission) {
          if (!user.hasPermission(prefix + permission[k])) {
            return false;
          }
        }
        return true;
    }
  } else {
    return user.hasPermission(prefix + permission);
  }
  return false;
}

export default {
  OR: _OR,
  AND: _AND,
  hasPermission: _hasPermission,
  hiddenStyle: (user: AuthUser, permission: string | string[], prefixId: string | null = null, logic: string | null = null) => {
    if (logic != null ? _hasPermission(user, permission, prefixId, logic) : _hasPermission(user, permission, prefixId)) {
      return '';
    }
    return 'display: none';
  }
}
