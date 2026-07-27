import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

function DisclosureProbe() {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        Evidence details
      </button>
      {open ? <p>Chapter-bounded evidence is visible.</p> : null}
    </section>
  );
}

describe('component test foundation', () => {
  it('exercises user-visible interaction', async () => {
    const user = userEvent.setup();
    render(<DisclosureProbe />);

    const button = screen.getByRole('button', { name: 'Evidence details' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Chapter-bounded evidence is visible.')).toBeVisible();
  });
});
