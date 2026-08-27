import React from 'react';
import '../src/styles.css';
import '../src/nen.css';
import '../src/styles/final-polish.css';
import '../src/components/succession/SuccessionVisualFoundation.css';

export default {
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="succession-archive" style={{ minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
