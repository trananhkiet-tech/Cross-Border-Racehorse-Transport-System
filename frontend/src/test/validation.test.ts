import { describe, expect, it } from 'vitest';
import { EMAIL_RE, MICROCHIP_RE, PHONE_RE, hasErrors, mergeErrors, passwordError, required } from '../features/common/validation';
import { validateHorse } from '../features/horses/HorseForm';
import type { HorsePayload } from '../types/api';

describe('validation chung', () => {
  it('kiểm tra mật khẩu: độ dài, chữ + số', () => {
    expect(passwordError('')).toBeDefined();
    expect(passwordError('abc123')).toMatch(/8 đến 72/);
    expect(passwordError('abcdefgh')).toMatch(/chữ và số/);
    expect(passwordError('12345678')).toMatch(/chữ và số/);
    expect(passwordError('Demo@123')).toBeUndefined();
    expect(passwordError('a1'.repeat(40))).toMatch(/8 đến 72/);
  });

  it('kiểm tra email', () => {
    expect(EMAIL_RE.test('customer@irtms.vn')).toBe(true);
    expect(EMAIL_RE.test('khong-hop-le')).toBe(false);
    expect(EMAIL_RE.test('a@b')).toBe(false);
  });

  it('kiểm tra microchip và số điện thoại', () => {
    expect(MICROCHIP_RE.test('985112345678901')).toBe(true);
    expect(MICROCHIP_RE.test('12345')).toBe(false);
    expect(MICROCHIP_RE.test('985 1123456789')).toBe(false);
    expect(PHONE_RE.test('+84 (28) 3822-1234')).toBe(true);
    expect(PHONE_RE.test('abc')).toBe(false);
  });

  it('required và hasErrors', () => {
    expect(required('  ', 'Tên')).toBe('Tên là bắt buộc');
    expect(required('x')).toBeUndefined();
    expect(hasErrors({ a: undefined, b: undefined })).toBe(false);
    expect(hasErrors({ a: undefined, b: 'lỗi' })).toBe(true);
  });

  it('mergeErrors: lỗi client ưu tiên hơn lỗi server, bỏ giá trị rỗng', () => {
    const m = mergeErrors({ a: 'client', b: undefined }, { a: 'server', b: 'server-b', c: 'server-c' });
    expect(m).toEqual({ a: 'client', b: 'server-b', c: 'server-c' });
  });
});

describe('validateHorse', () => {
  const ok = { registeredName: 'Thunder', microchipNumber: '985112345678901', passportNumber: 'PP-001', heightCm: 160 } as HorsePayload;
  it('hợp lệ', () => {
    expect(hasErrors(validateHorse(ok))).toBe(false);
  });
  it('thiếu tên / microchip / hộ chiếu', () => {
    const e = validateHorse({ ...ok, registeredName: '', microchipNumber: '', passportNumber: '' });
    expect(e.registeredName).toBeDefined();
    expect(e.microchipNumber).toBeDefined();
    expect(e.passportNumber).toBeDefined();
  });
  it('microchip sai định dạng, chiều cao ngoài khoảng, ngày sinh tương lai', () => {
    const e = validateHorse({ ...ok, microchipNumber: '12', heightCm: 50, dateOfBirth: '2999-01-01' });
    expect(e.microchipNumber).toMatch(/9–20/);
    expect(e.heightCm).toMatch(/100 đến 220/);
    expect(e.dateOfBirth).toMatch(/tương lai/);
  });
});
