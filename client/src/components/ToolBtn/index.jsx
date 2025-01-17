import PropTypes from 'prop-types';

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

ToolButton.propTypes = {
  tool: PropTypes.string.isRequired,
  btnType: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

