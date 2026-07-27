import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SafeImage from '../../src/components/SafeImage.jsx';

describe('SafeImage manifest integration', () => {
  it('resolves a generated Chimera Ant phase variant', () => {
    render(
      <SafeImage
        mediaId="media:chimera-ant:kite-phase"
        mediaVariant="phase"
        src="/media/portraits/kite.webp"
        alt="Kite during the Chimera Ant investigation in NGL"
        eager
      />,
    );

    const image = screen.getByRole('img', { name: 'Kite during the Chimera Ant investigation in NGL' });
    expect(image).toHaveAttribute('src', '/media/generated/chimera-ant/kite-phase.avif');
    expect(image).toHaveAttribute('width', '1200');
    expect(image).toHaveAttribute('height', '800');
    expect(image).toHaveAttribute('data-media-id', 'media:chimera-ant:kite-phase');
    expect(image).toHaveAttribute('data-media-variant', 'phase');
    expect(image).toHaveAttribute('data-media-safe-text', 'bottom');
  });
});
