import styled from 'styled-components';
import { useContext } from 'react';
import { StoreContext } from '@providers';

export const QuestLog = () => {
  const { store } = useContext(StoreContext);

  return (
    <Wrapper>
      {store.questLog.map((quest, questIndex) => (
        <Quest key={`quest-${quest.id}`}>
          <QuestName>{questIndex + 1}. {quest.name}</QuestName>
          {quest.steps.map((step, stepIndex) => <QuestStep key={`quest-${quest.id}-step-${step.id}`}>{questIndex + 1}.{stepIndex + 1}. {step.name}</QuestStep>)}
        </Quest>
      ))}
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

const Quest = styled('div')`
  color: #fff;
  font-size: 15px;
  margin-bottom: 15px;
  &:last-of-type {
    margin-bottom: 0;
  }
`

const QuestName = styled('div')`
  font-weight: bold;
`

const QuestStep = styled('div')`
  margin-bottom: 3px;
  margin-left: 3px;
  &:last-of-type {
    margin-bottom: 0;
  }
`