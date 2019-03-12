import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { twat } from './fakeData';

export default (function MockTimelineService() {
  const _randomInt = () => Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
  const _getDataModel = twat;
  let f = true;
  /**
   * twatTimelineStream
   * @returns Observable of timeline
   */
  const twatTimeline$ = () => {
    return interval(_randomInt()).pipe(map(_getTwatData));
  };

  const _getTwatData = () => {
    if (f) {
      f = false;
      return new Array(5).fill().map(_getDataModel);
    }
    return [_getDataModel()];
  };

  return { twatTimeline$ };
})();
