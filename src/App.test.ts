import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders hello world', () => {
    expect(App()).toBe('Hello, World!');
  });
});