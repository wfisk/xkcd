import { Enum } from '/src/lib/enums/enumify';

import { faHourglass } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

class MarketStatus extends Enum {}

MarketStatus.initEnum({
  READY: {
    icon: faHourglass,
    iconStyle: 'color: var(--warning)',
    id: 'market-not-started',
    text: 'Not Started',
    textClass: 'text-body',
  },
  IN_PROGRESS: {
    icon: faHourglassHalf,
    iconStyle: 'color: var(--warning)',
    id: 'market-in-progress',
    text: 'In Progress',
    textClass: 'text-body',
  },
  COMPLETED: {
    icon: faCheck,
    iconStyle: 'color: var(--success)',
    id: 'market-completed',
    text: 'Completed',
    textClass: 'text-body',
  },
});

export default MarketStatus;
