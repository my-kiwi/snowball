// check that each level has a map and that the map is a non-empty 2D array of exactly the correct size
import { levels, tileType, TileChar } from './levels';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Levels', () => {
    it('should have at least one level', () => {
        expect(levels.length).toBeGreaterThan(0);
    });

    levels.forEach((level, index) => {
        describe(`Level ${index + 1} - ${level.name}`, () => {
            it('should have a map', () => {
                expect(level.map).toBeDefined();
            });

            it('map should be a non-empty 2D array', () => {
                expect(Array.isArray(level.map)).toBe(true);
                expect(level.map.length).toBeGreaterThan(0);
                expect(Array.isArray(level.map[0])).toBe(true);
                expect(level.map[0].length).toBeGreaterThan(0);
            });

            it('all rows in the map should have the same length', () => {   
                const rowLength = level.map[0].length;
                level.map.forEach(row => {
                    expect(row.length).toBe(rowLength);
                });
            });

            it('should only contain valid tile characters', () => {
                const validTiles = new Set(Object.values(tileType));
                level.map.forEach(row => {
                    row.forEach(tile => {
                        expect(validTiles.has(tile)).toBe(true);
                    });
                });
            });

            it('should be exactly 11x26 tiles', () => {
                expect(level.map.length).toBe(26);
                level.map.forEach(row => {
                    expect(row.length).toBe(11);
                });
            });
        });
    });
});