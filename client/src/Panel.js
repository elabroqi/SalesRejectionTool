const Panel = ({ title, children, className = "" }) => {
  const panelStyle = {
    backgroundColor: '#374151',
    color: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #4B5563',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#93C5FD'
  };

  return (
    <div style={panelStyle} className={className}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default Panel;
