// Copied from Taylor Liesnham
// https://codepen.io/Chub/pen/AGBjVJ
import './Compass.css'
interface CompassProps {
  deg: number
}
export const Compass = (props: CompassProps) => {
  return (
    <div className="compass">
      <div className="compass-inner">
        <div className="north">N</div>
        <div className="east">E</div>
        <div className="west">W</div>
        <div className="south">S</div>
        <div className="main-arrow" style={{ transform: `rotate(${props.deg}deg)` }}>
        <div className="arrow-up"></div>
          <div className="arrow-down"></div>
        </div>
      </div>
    </div>
  )
}