import { Cached, Check, FastForward, RemoveCircle, WatchLater } from '@mui/icons-material';

export const statusColorObject = {
  not_apply: '#929fba',
  completed: '#00b2aa',
  in_progress: '#438edf',
  under_progress: '#438edf',
  partially_completed: '#438edf',
  delayed: '#e85b71',
  not_completed: '#e85b71',
  in_transition: '#d8cb6e'
};

export const statusIconObject = {
  not_apply: <RemoveCircle />,
  completed: <Check />,
  in_progress: <Cached />,
  under_progress: <Cached />,
  partially_completed: <Cached />,
  delayed: <WatchLater />,
  not_completed: <WatchLater />,
  in_transition: <FastForward />
};

export const subTotal = {
  not_apply: '', //grey
  completed: 100, //green
  in_progress: 50, //blue
  under_progress: 50, //blue
  partially_completed: 50, //blue
  delayed: 0, //red
  not_completed: 0, //red
  in_transition: '' //yellow
};
