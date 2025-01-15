export const ToolButton = ({ tool,btnType, width, height, onClick, icon }) => {
  return (
    <div
      className={`${btnType} hover-tool`}
      id={tool === "rect" ? "Rectangle" : tool} 
    >
      <img
        width={width || "30"}
        height={height || "30"}
        id={tool === "highlighter" ? "High Lighter" : tool === "eraser" ? tool : ""} 
        onClick={() => onClick(tool)}
        src={icon}
        alt={tool}
      />
    </div>
  );
};
