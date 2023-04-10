import { StoreContext } from '@providers';
import { useContext } from 'react';
import styled from 'styled-components';

const player = {
  name: 'thesvst',
  level: 1,
};

const startDate = new Date();

export const HeadsUp = () => {
  const { store } = useContext(StoreContext);
  const time = Math.round((new Date().getTime() - startDate.getTime()) / 1000);

  return (
    <Wrapper>
      <Row>
        <Property>Name: </Property>
        <Value>{player.name}</Value>
      </Row>
      <Row>
        <Property>Level: </Property>
        <Value>{player.level}</Value>
      </Row>
      <Row>
        <Property>Distance: </Property>
        <Value>{store.distance} meters</Value>
      </Row>
      <Row>
        <Property>Velocity: </Property>
        <Value>{store.velocity} km/h</Value>
      </Row>
      <Row>
        <Property>Pitch: </Property>
        <Value>{Math.round(store.pitch * 1000) / 1000}</Value>
      </Row>
      <Row>
        <Property>Bearing: </Property>
        <Value>{Math.round(store.bearing * 1000) / 1000}</Value>
      </Row>
      <Row>
        <Property>Time: </Property>
        <Value>{time}</Value>
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
