const Test = ({
  open,
  children,
  title,
  toggleView,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  toggleView: () => void;
}) => {
  const wrapperStyle = "flex flex-col border border-slate-400 rounded-md";
  const buttonStyle = "p-4 bg-blue-300 font-semibold";
  const styleProps = {
    padding: "1rem",
    display: open ? "block" : "none",
  };

  return (
    <div className={wrapperStyle}>
      <button onClick={toggleView} className={buttonStyle}>
        {title}
      </button>
      <p style={styleProps}>{children}</p>
    </div>
  );
};

export default Test;
