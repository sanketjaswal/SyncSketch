import PropTypes from "prop-types";

export const Slider = ({ min, max, defVal, onClick, id }) => {
  return (
    <div className="control-item brush-div hover-tool" id={id}>
      <input
        type="range"
        min={min}
        max={max}
        defaultValue={defVal}
        className="slider"
        id="myRange"
        onChange={(e) => onClick(e.target.value)}
      ></input>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  defVal: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
