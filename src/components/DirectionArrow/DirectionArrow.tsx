import styled from 'styled-components';

interface DirectionArrowProps {
  angle: number,
}

export const DirectionArrow = (props: DirectionArrowProps) => {
  console.log(props.angle)

  return (
    <div style={{ transition: '.15s ease all', transform: `rotate(${Math.round(props.angle)}deg)` }}>
      <Arrow />
    </div>
  )
};

const Arrow = styled('div')`
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 65px solid #EF5052;
`