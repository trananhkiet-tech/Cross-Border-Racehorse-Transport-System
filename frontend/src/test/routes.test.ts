import { describe, expect, it } from 'vitest';
import { MENUS } from '../routes/menu';
import { ROUTE_ROLES } from '../routes/AppRoutes';
import { RoleValues } from '../types/enums';

describe('bảng route ↔ menu', () => {
  it('không có route trùng đường dẫn', () => {
    const paths = ROUTE_ROLES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('chỉ có đúng 5 role, không có VETERINARIAN', () => {
    expect(RoleValues).toHaveLength(5);
    expect(RoleValues.map(String)).not.toContain('VETERINARIAN');
    expect(Object.keys(MENUS).sort()).toEqual([...RoleValues].sort());
  });

  it.each(RoleValues)('mọi mục menu của %s đều dẫn tới route mà role đó được phép vào', (role) => {
    for (const g of MENUS[role]) {
      for (const item of g.items) {
        const route = ROUTE_ROLES.find((r) => r.path === item.to.replace(/^\//, ''));
        expect(route, `thiếu route cho ${item.to}`).toBeDefined();
        if (route?.roles) expect(route.roles, `${role} không được vào ${item.to}`).toContain(role);
      }
    }
  });

  it('khách hàng không có route quản trị / vận hành nội bộ', () => {
    const internal = ['reports', 'payments', 'pricing', 'fleet', 'staff', 'planning', 'compliance/requirements'];
    for (const p of internal) {
      const r = ROUTE_ROLES.find((x) => x.path === p);
      expect(r?.roles, p).toBeDefined();
      expect(r?.roles).not.toContain('CUSTOMER');
    }
  });
});

import { canAccess, ROUTE_ACCESS, routePattern } from '../routes/access';

describe('canAccess / routePattern', () => {
  it('nhận diện mẫu route từ đường dẫn cụ thể', () => {
    expect(routePattern('/horses/12')).toBe('horses/:id');
    expect(routePattern('/horses/new')).toBe('horses/new');
    expect(routePattern('/requests/5/edit')).toBe('requests/:id/edit');
    expect(routePattern('/trips?status=x')).toBe('trips');
  });
  it('driver không vào được hồ sơ ngựa / tuyến / yêu cầu (backend trả 403)', () => {
    expect(canAccess('/horses/1', 'DRIVER_ESCORT')).toBe(false);
    expect(canAccess('/routes/1', 'DRIVER_ESCORT')).toBe(false);
    expect(canAccess('/requests/1', 'DRIVER_ESCORT')).toBe(false);
    expect(canAccess('/trips/1', 'DRIVER_ESCORT')).toBe(true);
  });
  it('khách hàng chỉ vào trang của mình', () => {
    expect(canAccess('/claims/new', 'CUSTOMER')).toBe(true);
    expect(canAccess('/reports', 'CUSTOMER')).toBe(false);
    expect(canAccess('/planning', 'CUSTOMER')).toBe(false);
  });
  it('mọi route trong AppRoutes đều có trong bảng quyền', () => {
    for (const r of ROUTE_ROLES) expect(r.path in ROUTE_ACCESS, r.path).toBe(true);
  });
});
