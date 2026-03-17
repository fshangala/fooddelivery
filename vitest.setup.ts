import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mocking Supabase client since we don't have a real DB in tests
vi.mock('./lib/supabase/client', () => ({
    default: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                }))
            })),
            select: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null })),
                eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                }))
            })),
            update: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
            })),
        }))
    }
}));
