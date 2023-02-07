import '@testing-library/jest-dom';
import { server } from 'test/server/test-server';
import { TextDecoder, TextEncoder } from 'util';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
