import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { Page, TripSummary } from '../types/api';
import { makeUser, renderAt } from './utils';

let listOutcome: () => Promise<Page<TripSummary>>;
vi.mock('../api/endpoints', () => ({ tripApi: { list: () => listOutcome() } }));
vi.mock('../app/AuthContext', () => ({
  useAuth: () => ({ user: makeUser('LOGISTICS_MANAGER'), initializing: false }),
  useCurrentUser: () => makeUser('LOGISTICS_MANAGER'),
}));

import { TripListPage } from '../features/trips/TripListPage';

const trip: TripSummary = {
  id: 1, tripNumber: 'TRP-2026-0001', requestId: 1, requestNumber: 'REQ-2026-0001', customerName: 'Nguyễn Văn A', routeId: 1,
  routeName: 'TP.HCM → Singapore', originLocation: 'TP.HCM', destinationLocation: 'Singapore', transportMode: 'AIR',
  plannedDeparture: '2026-11-01T08:00:00', plannedArrival: '2026-11-01T14:00:00', status: 'IN_TRANSIT', operationBlocked: true, staffNames: ['Tài xế A'],
};
const page = (content: TripSummary[]): Page<TripSummary> => ({ content, page: 0, size: 10, totalElements: content.length, totalPages: 1 });

function render() {
  return renderAt(<Routes><Route path="/trips" element={<TripListPage />} /></Routes>, '/trips');
}

describe('TripListPage', () => {
  beforeEach(() => { listOutcome = () => Promise.resolve(page([trip])); });

  it('hiển thị chuyến, trạng thái tiếng Việt và cảnh báo tạm dừng', async () => {
    render();
    expect(await screen.findByText('TRP-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('Đang vận chuyển', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Tạm dừng')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
  });

  it('danh sách rỗng → trạng thái rỗng', async () => {
    listOutcome = () => Promise.resolve(page([]));
    render();
    expect(await screen.findByText('Chưa có chuyến đi')).toBeInTheDocument();
  });

  it('lỗi mạng → hiển thị thông báo lỗi và nút thử lại, không lộ chi tiết kỹ thuật', async () => {
    listOutcome = () => Promise.reject(new AxiosError('Network Error'));
    render();
    expect(await screen.findByText(/Không kết nối được máy chủ/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thử lại/i })).toBeInTheDocument();
  });
});
