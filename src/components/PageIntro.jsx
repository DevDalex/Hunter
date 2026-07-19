export default function PageIntro({ kicker, title, description, compact = false, children }) {
  return (
    <section className={`page-intro${compact ? ' page-intro--compact' : ''}`} aria-labelledby="page-title">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h1 id="page-title">{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
