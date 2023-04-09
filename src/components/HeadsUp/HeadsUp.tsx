import styled from 'styled-components';

const player = {
  name: 'thesvst',
  level: 1,
};

export const HeadsUp = () => {
  return (
    <Wrapper>
      <Row>
        <Property>Name:</Property>
        <Value>{player.name}</Value>
      </Row>
      <Row>
        <Property>Level: </Property>
        <Value>{player.level}</Value>
      </Row>
      <Row>
        <Property>Distance: </Property>
        <Value>0 meters</Value>
      </Row>
      <Row>
        <Property>Velocity: </Property>
        <Value>0 km/h</Value>
      </Row>
      <Row>
        <Property>Angle: </Property>
        <Value>0</Value>
      </Row>
      <Row>
        <Property>Bearing: </Property>
        <Value>0</Value>
      </Row>
      <Row>
        <Property>Time: </Property>
        <Value>0</Value>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  user-select: none;
  font-size: 22px;
`;

const Row = styled('div')`
  display: flex;
`;

const Property = styled('div')`
  margin-right: 5px;
  font-weight: bold;
  color: wheat;
`;

const Value = styled('div')`
  color: #fff;
`;
