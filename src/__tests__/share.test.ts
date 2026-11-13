import { describe, it, expect, vi } from 'vitest';
import { shareOrDownload } from '../lib/shareCard';

const blob = () => new Blob(['x'], { type: 'image/png' });

describe('shareOrDownload', () => {
  it('falls back to download when navigator.share is unavailable', async () => {
    const download = vi.fn();
    const r = await shareOrDownload(blob(), 'hi', { nav: {} as never, download });
    expect(r).toBe('downloaded');
    expect(download).toHaveBeenCalledOnce();
    expect(download.mock.calls[0][1]).toMatch(/\.png$/);
  });

  it('falls back to download when files cannot be shared', async () => {
    const download = vi.fn();
    const share = vi.fn();
    const r = await shareOrDownload(blob(), 'hi', { nav: { share, canShare: () => false }, download });
    expect(r).toBe('downloaded');
    expect(share).not.toHaveBeenCalled();
  });

  it('shares the PNG file when supported', async () => {
    const download = vi.fn();
    const share = vi.fn().mockResolvedValue(undefined);
    const r = await shareOrDownload(blob(), 'hi', { nav: { share, canShare: () => true }, download });
    expect(r).toBe('shared');
    expect(share.mock.calls[0][0].files[0].type).toBe('image/png');
    expect(download).not.toHaveBeenCalled();
  });

  it('treats cancel as cancelled, other errors as download', async () => {
    const download = vi.fn();
    const abort = vi.fn().mockRejectedValue(new DOMException('x', 'AbortError'));
    expect(await shareOrDownload(blob(), 'h', { nav: { share: abort, canShare: () => true }, download })).toBe('cancelled');
    const boom = vi.fn().mockRejectedValue(new Error('boom'));
    expect(await shareOrDownload(blob(), 'h', { nav: { share: boom, canShare: () => true }, download })).toBe('downloaded');
  });
});
