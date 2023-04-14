import styled from 'styled-components';
import { useContext } from 'react';
import { StoreContext } from '@providers';

export const QuestLog = () => {
  const { store } = useContext(StoreContext);

  return (
    <Wrapper>
      <QuestState>
        <QuestStateHeading>Current task</QuestStateHeading>
        <QuestStateContent>
          {store.questLog.current ? (
            <Quest key={`quest-${store.questLog.current.id}`}>
              <QuestName>{store.questLog.current.name}</QuestName>
              {store.questLog.current.steps.map((step, stepIndex) => {
                return (
                  <QuestStep
                    key={`quest-current-step-${step.id}`}
                    active={store.questLog.current?.activeStep === stepIndex}
                    finished={(store.questLog.current?.activeStep ?? 0) > stepIndex}
                  >
                    {stepIndex + 1}. {step.name}
                  </QuestStep>
                )
              })}
            </Quest>
          ) : (
            <QuestEmptyState>None quest activated</QuestEmptyState>
          )}
        </QuestStateContent>
      </QuestState>

     <QuestState>
       <QuestStateHeading>Available tasks</QuestStateHeading>
       <QuestStateContent>
         {store.questLog.available.length ? (
           store.questLog.available.map((quest, questIndex) => (
             <Quest key={`quest-${quest.id}`}>
               <QuestName>{questIndex + 1}. {quest.name}</QuestName>
               {quest.steps.map((step, stepIndex) => (
                 <QuestStep key={`quest-${quest.id}-step-${step.id}`}>
                   {questIndex + 1}.{stepIndex + 1}. {step.name}
                 </QuestStep>
               ))}
             </Quest>
           ))
         ) : (
           <QuestEmptyState>None quests available</QuestEmptyState>
         )}
       </QuestStateContent>
     </QuestState>

      <QuestState>
        <QuestStateHeading>Completed tasks</QuestStateHeading>
        <QuestStateContent>
          {store.questLog.completed.length ? (
            store.questLog.completed.map((quest, questIndex) => (
              <Quest key={`quest-${quest.id}`} completed>
                <QuestName>{questIndex + 1}. {quest.name}</QuestName>
                {quest.steps.map((step, stepIndex) => (
                  <QuestStep
                    key={`quest-${quest.id}-step-${step.id}`}
                  >
                    {questIndex + 1}.{stepIndex + 1}. {step.name}
                  </QuestStep>
                ))}
              </Quest>
            ))
          ) : (
              <QuestEmptyState>None quests completed</QuestEmptyState>
          )}
        </QuestStateContent>
      </QuestState>

    </Wrapper>
  );
};

const Wrapper = styled('div')`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  user-select: none;
  font-size: 22px;
  color: #fff;
`;

const Quest = styled('div')`
  color: #fff;
  font-size: 15px;
  margin-bottom: 15px;
  &:last-of-type {
    margin-bottom: 0;
  }
  ${(props: { completed: boolean }) => props.completed && 'text-decoration: line-through'}
`

const QuestName = styled('div')`
  
`

const QuestStep = styled('div')`
  margin-bottom: 3px;
  margin-left: 3px;
  &:last-of-type {
    margin-bottom: 0;
  }
  ${(props: { active: boolean, finished: boolean }) => ({
    color: props.active && 'green',
    textDecoration: props.finished && 'line-through'
  })}
`

const QuestState = styled('div')`
  margin-bottom: 20px;
  &:last-of-type {
    margin-bottom: 0;
  }
`

const QuestStateHeading = styled('div')`
  color: wheat
`

const QuestStateContent = styled('div')`
  
`

const QuestEmptyState = styled('div')`
 color: #ccc;
  font-size: 14px;
  margin-left: 3px;
`