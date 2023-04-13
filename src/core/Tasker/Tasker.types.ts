type Step = {
  id: number;
  coordinates: [number, number];
  name: string;
};

export type Task = {
  id: 1;
  coordinates: [number, number];
  name: string;
  rewards: [];
  steps: Step[];
  activeStep: number;
};
