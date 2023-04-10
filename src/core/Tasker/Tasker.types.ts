type Step = {
  id: number;
  coordinates: [number, number];
  name: string;
};

export type Task = {
  id: 1;
  coordinates: any;
  name: any;
  rewards: [];
  steps: Step[];
  activeStep: number;
};
