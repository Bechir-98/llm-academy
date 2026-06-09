function CodeBlock({ language, code }) {
  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-dots">
          <span className="code-dot red" />
          <span className="code-dot yellow" />
          <span className="code-dot green" />
        </div>
        <span className="code-lang">{language}</span>
      </div>
      <div className="code-body">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

export default CodeBlock;
