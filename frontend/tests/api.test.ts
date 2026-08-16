import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDashboardSummary } from '@/lib/api';

describe('api helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the dashboard summary from the configured API base', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ active_campaigns: 2, totals: { impressions: 10 } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const summary = await getDashboardSummary();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/dashboard/summary',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
    expect(summary.active_campaigns).toBe(2);
  });

  it('throws a useful error message on non-ok responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'boom',
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getDashboardSummary()).rejects.toThrow('boom');
  });
});
