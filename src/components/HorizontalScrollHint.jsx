import { MoveHorizontal } from 'lucide-react';

export default function HorizontalScrollHint({ children = 'This research view continues sideways. Swipe or use Shift + mouse wheel to inspect the complete record.' }) {
  return (
    <p className="horizontal-scroll-hint" role="note">
      <MoveHorizontal size={17} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
