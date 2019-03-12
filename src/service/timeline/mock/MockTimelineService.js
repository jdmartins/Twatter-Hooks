import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { timeline } from './fakeData';

export default (function MockTimelineService() {
  const _randomInt = () => Math.floor(Math.random() * (10000 - 3000 + 1) + 3000);
  const _getDataModel = timeline;

  /**
   * timelineStream
   * @returns Observable of timeline
   */
  const timeline$ = () => {
    return interval(_randomInt()).pipe(map(_getDataModel));
  };

  const getTimelineData = () => {
    return new Array(4).fill().map(_getDataModel);
  };

  return { timeline$, getTimelineData };
})();
