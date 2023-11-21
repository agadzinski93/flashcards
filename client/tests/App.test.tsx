import React from 'react';
import {describe, it, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import Button from '../src/components/ui/Button'
import axe from 'axe-core';

describe('something truthy and falsy', () => {
    it('true to be true', () => {
      expect(true).toBe(true);
    });
  
    it('false to be false', () => {
      expect(false).toBe(false);
    });
  });

describe('Button',()=>{
    it('Render Button Without Event',()=>{
        render(<Button text={"Click Me"} />);
        screen.debug();
    })
});

test("Accessibility Check", async ()=> {
  const {container} = render(<Button text={"Click Me"} />);
  const results = await axe.run(container);
  expect(results.violations.length).toBe(0);
});