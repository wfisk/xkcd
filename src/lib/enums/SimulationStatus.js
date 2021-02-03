import { Enum } from '/src/lib/enums/enumify';

import { faHourglass } from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faCheck,
  faHourglassEnd,
  faHourglassHalf,
  faHourglassStart,
} from '@fortawesome/free-solid-svg-icons';

class SimulationStatus extends Enum {}

// SimulationStatus.initEnum(['NOT_STARTED', 'STARTED', 'FINISHED', 'ARCHIVED']);

SimulationStatus.initEnum({
  NOT_OPEN: {
    icon: faBan,
    iconClass: 'icon icon-no-entry icon-fw',
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-not-open',
    text: 'Not Open',
    textClass: 'text-secondary',
  },
  OPEN: {
    icon: faHourglassStart,
    iconStyle: 'color: var(--warning)',
    id: 'simulation-open',
    text: 'Open',
    textClass: 'text-body',
  },
  IN_PROGRESS: {
    icon: faHourglassHalf,
    iconStyle: 'color: var(--warning)',
    id: 'simulation-in-progress',
    text: 'In Progress',
    textClass: 'text-body',
  },
  COMPLETED: {
    icon: faCheck,
    iconStyle: 'color: var(--success)',
    id: 'simulation-completed',
    text: 'Completed',
    textClass: 'text-body',
  },
  CLOSED: {
    icon: faHourglassEnd,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-ready-closed',
    text: 'Closed',
    textClass: 'text-secondary',
  },
  IN_PROGRESS_CLOSED: {
    icon: faHourglassHalf,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-in-progress-closed',
    text: 'In Progress',
    textClass: 'text-secondary',
  },
  COMPLETED_CLOSED: {
    icon: faCheck,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-completed-closed',
    text: 'Completed',
    textClass: 'text-secondary',
  },
  ARCHIVED: {
    icon: faHourglassStart,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-archived',
    text: 'Archived',
    textClass: 'text-secondary',
  },
  IN_PROGRESS_ARCHIVED: {
    icon: faHourglassHalf,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-archived',
    text: 'In progress (archived)',
    textClass: 'text-secondary',
  },
  COMPLETED_ARCHIVED: {
    icon: faCheck,
    iconStyle: 'color: var(--secondary)',
    id: 'simulation-archived',
    text: 'Completed (archived)',
    textClass: 'text-secondary',
  },
});

export default SimulationStatus;
