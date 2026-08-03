import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import WorkspaceNav from '../../src/components/WorkspaceNav.jsx';

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'research', label: 'Research' },
];

describe('WorkspaceNav', () => {
  it('marks the active page and emits one selection for a desktop click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<WorkspaceNav items={items} activeId="overview" onSelect={onSelect} label="Archive sections" />);

    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Research' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('research');
  });

  it('preloads and selects the same destination through the compact control', async () => {
    const user = userEvent.setup();
    const onIntent = vi.fn();
    const onSelect = vi.fn();

    render(
      <WorkspaceNav
        items={items}
        activeId="overview"
        onIntent={onIntent}
        onSelect={onSelect}
        label="Archive sections"
      />,
    );

    await user.selectOptions(screen.getByRole('combobox', { name: 'Archive sections' }), 'research');

    expect(onIntent).toHaveBeenCalledTimes(1);
    expect(onIntent).toHaveBeenCalledWith('research');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('research');
  });
});
