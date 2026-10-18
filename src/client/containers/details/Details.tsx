import { Content } from '@client/components/Content';
import { Navbar } from '@client/components/Navbar';
import {
  DetailsStoreProvider,
  useDetailsDispatch,
  useDetailsState,
} from '@client/providers/DetailsStoreProvider';
import { DETAILS_STEPS, DetailsCommand, DetailsStep, errorStep } from '@core/display/details';
import { validateDraft } from '@core/rules';
import { Alert, App, Button, Flex, Result, Spin, Steps } from 'antd';
import { type FC, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  BasicsStep,
  CharacteristicsStep,
  OccupationStep,
  SkillsStep,
  SummaryStep,
} from './components';
import { useDetailsEffects } from './Details.effect';
import { StepFooter } from './Details.styles';
import { investigatorErrorMessage } from './error-message';

const STEP_TITLES: Record<DetailsStep, string> = {
  [DetailsStep.basics]: 'Basics',
  [DetailsStep.occupation]: 'Occupation',
  [DetailsStep.characteristics]: 'Stats',
  [DetailsStep.skills]: 'Skills',
  [DetailsStep.summary]: 'Summary',
};

const STEP_CONTENT: Record<DetailsStep, FC> = {
  [DetailsStep.basics]: BasicsStep,
  [DetailsStep.occupation]: OccupationStep,
  [DetailsStep.characteristics]: CharacteristicsStep,
  [DetailsStep.skills]: SkillsStep,
  [DetailsStep.summary]: SummaryStep,
};

export const Details: FC = () => (
  <DetailsStoreProvider>
    <DetailsPage />
  </DetailsStoreProvider>
);

const DetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const loadedId = useDetailsState((state) => state.id);
  const step = useDetailsState((state) => state.step);
  const draft = useDetailsState((state) => state.draft);
  const notFound = useDetailsState((state) => state.notFound);
  const justSaved = useDetailsState((state) => state.justSaved);
  const isLoading = useDetailsState(
    (state) => state.command.type === DetailsCommand.loadInvestigator.type,
  );
  const dispatch = useDetailsDispatch();
  const errors = useMemo(() => validateDraft(draft), [draft]);

  useDetailsEffects();

  // Load when opening /investigators/:id. After saving a new investigator the URL gains the id
  // that the store already holds, so nothing is reloaded.
  useEffect(() => {
    if (id !== undefined && id !== loadedId) dispatch.startLoadInvestigator(id);
  }, [id, loadedId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: show the message once per save, not when `message` changes
  useEffect(() => {
    if (justSaved) message.success('Saved');
  }, [justSaved]);

  const title = draft.name || (loadedId === undefined ? 'New investigator' : 'Investigator');
  const navbar = <Navbar title={title} onBack={() => navigate('/')} />;

  if (notFound) {
    return (
      <>
        {navbar}
        <Content>
          <Result
            status="404"
            title="Investigator not found"
            extra={<Link to="/">Back to dashboard</Link>}
          />
        </Content>
      </>
    );
  }

  const stepIndex = DETAILS_STEPS.indexOf(step);
  // Steps are only marked from Summary, so unvisited steps don't look like mistakes.
  const stepsWithErrors = new Set(step === DetailsStep.summary ? errors.map(errorStep) : []);
  const stepErrors = errors.filter((error) => errorStep(error) === step);
  const StepContent = STEP_CONTENT[step];

  return (
    <>
      {navbar}
      <Content>
        <Steps
          type="dot"
          size="small"
          titlePlacement="vertical"
          responsive={false}
          current={stepIndex}
          onChange={(index) => {
            const next = DETAILS_STEPS[index];
            if (next) dispatch.goToStep(next);
          }}
          items={DETAILS_STEPS.map((itemStep) => ({
            title: STEP_TITLES[itemStep],
            status: stepsWithErrors.has(itemStep) ? 'error' : undefined,
          }))}
        />

        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            {/* Summary lists every problem itself; other steps show only their own. */}
            {step !== DetailsStep.summary && stepErrors.length > 0 && (
              <Alert
                type="warning"
                showIcon
                message={
                  <Flex vertical>
                    {stepErrors.map((error) => {
                      const text = investigatorErrorMessage(error);
                      return <span key={text}>{text}</span>;
                    })}
                  </Flex>
                }
              />
            )}
            <StepContent />
            {step !== DetailsStep.summary && (
              <StepFooter justify="space-between">
                <Button
                  disabled={stepIndex === 0}
                  onClick={() => {
                    const previous = DETAILS_STEPS[stepIndex - 1];
                    if (previous) dispatch.goToStep(previous);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    const next = DETAILS_STEPS[stepIndex + 1];
                    if (next) dispatch.goToStep(next);
                  }}
                >
                  Next
                </Button>
              </StepFooter>
            )}
          </>
        )}
      </Content>
    </>
  );
};
