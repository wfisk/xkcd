import { Enum } from '/src/lib/enums/enumify';

import { faHourglass } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

class MarketStatus extends Enum {}

CompanyMemberStatus.initEnum({
  ONLINE: {
    icon: faHourglass,
    iconStyle: 'color: var(--warning)',
    id: 'market-not-started',
    text: 'Not Started',
    textClass: 'text-body',
  },
  OFFLINE: {
    icon: faHourglassHalf,
    iconStyle: 'color: var(--warning)',
    id: 'market-in-progress',
    text: 'In Progress',
    textClass: 'text-body',
  },
});

export default MarketStatus;
