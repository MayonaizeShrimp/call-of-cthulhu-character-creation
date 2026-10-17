import { describe, expect, it } from 'vitest';
import { CHARACTERISTICS, POINT_BUY } from './characteristics';
import { OCCUPATIONS } from './occupations';
import { SKILLS } from './skills';

const skillIds: string[] = SKILLS.map((skill) => skill.id);

describe('CHARACTERISTICS', () => {
  it('lists the eight 7e characteristics once each', () => {
    expect([...CHARACTERISTICS].sort()).toEqual(
      ['APP', 'CON', 'DEX', 'EDU', 'INT', 'POW', 'SIZ', 'STR'].sort(),
    );
  });

  it('allows a point-buy spread that fits the per-characteristic limits', () => {
    expect(CHARACTERISTICS.length * POINT_BUY.min).toBeLessThanOrEqual(POINT_BUY.total);
    expect(CHARACTERISTICS.length * POINT_BUY.max).toBeGreaterThanOrEqual(POINT_BUY.total);
  });
});

describe('SKILLS', () => {
  it('has unique kebab-case ids', () => {
    expect(new Set(skillIds).size).toBe(skillIds.length);
    for (const id of skillIds) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it('leaves out Cthulhu Mythos and Credit Rating', () => {
    expect(skillIds).not.toContain('cthulhu-mythos');
    expect(skillIds).not.toContain('credit-rating');
  });
});

describe('OCCUPATIONS', () => {
  it('has unique kebab-case ids', () => {
    const ids: string[] = OCCUPATIONS.map((occupation) => occupation.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it.each(OCCUPATIONS.map((occupation) => [occupation.name, occupation] as const))(
    '%s is well-formed',
    (_, occupation) => {
      expect(occupation.skillPoints.length).toBeGreaterThan(0);
      for (const term of occupation.skillPoints) {
        expect(term.anyOf.length).toBeGreaterThan(0);
        expect(term.multiplier).toBeGreaterThan(0);
      }

      const referenced: string[] = [
        ...occupation.skills,
        ...occupation.skillChoices.flatMap((choice) => choice.options),
      ];
      for (const id of referenced) expect(skillIds).toContain(id);

      for (const choice of occupation.skillChoices) {
        expect(choice.count).toBeLessThanOrEqual(choice.options.length);
        for (const option of choice.options) {
          expect(occupation.skills as readonly string[]).not.toContain(option);
        }
      }
      expect(occupation.anySkills).toBeGreaterThanOrEqual(0);
    },
  );
});
