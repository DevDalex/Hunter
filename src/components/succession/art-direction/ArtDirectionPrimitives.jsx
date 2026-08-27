import { motion, useReducedMotion } from 'motion/react';
import './SuccessionArtDirection.css';

const classes = (...values) => values.filter(Boolean).join(' ');

export function ArtCanvas({ as: Element = 'section', className = '', children, ...props }) {
  return <Element className={classes('succession-art-direction succession-art-canvas', className)} {...props}>{children}</Element>;
}

export function MonumentTitle({ as: Element = 'h1', className = '', children, ...props }) {
  return <Element className={classes('succession-art-monument', className)} {...props}>{children}</Element>;
}

export function DisplayTitle({ as: Element = 'h2', className = '', children, ...props }) {
  return <Element className={classes('succession-art-display', className)} {...props}>{children}</Element>;
}

export function MetaRail({ items = [], className = '', ...props }) {
  return <div className={classes('succession-art-meta succession-art-meta-rail', className)} {...props}>
    {items.filter(Boolean).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
  </div>;
}

export function BleedMedia({
  src,
  alt = '',
  focal = '50% 50%',
  bleed = 'none',
  fragment = false,
  className = '',
  eager = false,
  ...props
}) {
  const bleedClass = bleed === 'left'
    ? 'is-bleed-left'
    : bleed === 'right'
      ? 'is-bleed-right'
      : '';

  return <figure
    className={classes('succession-art-media', bleedClass, fragment && 'is-fragment', className)}
    style={{ '--succession-art-focal': focal }}
    {...props}
  >
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  </figure>;
}

export function Annotation({ className = '', children, ...props }) {
  return <aside className={classes('succession-art-annotation', className)} {...props}>{children}</aside>;
}

export function StoryBeat({ title, children, className = '', ...props }) {
  return <article className={classes('succession-art-story-beat', className)} {...props}>
    <strong>{title}</strong>
    {children && <p>{children}</p>}
  </article>;
}

export function Reveal({ children, className = '', distance = 28, delay = 0, ...props }) {
  const reduceMotion = useReducedMotion();
  return <motion.div
    className={className}
    initial={reduceMotion ? false : { opacity: 0, y: distance }}
    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.22 }}
    transition={{ duration: 0.62, delay, ease: [0.2, 0.75, 0.25, 1] }}
    {...props}
  >
    {children}
  </motion.div>;
}
