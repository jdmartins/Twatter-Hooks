import React, { useEffect, useReducer, Fragment } from 'react';
import TimelineItem from './TimelineItem';
import MockTimelineService from '../service/timeline/mock/MockTimelineService';

const Timeline = () => {
  const addToItems = ({ items, buffer }) => {
    window.scrollTo({ top: 0 });
    return {
      // empty the buffer
      items: [...buffer, ...items],
      buffer: []
    };
  };

  const handleRetweet = (state, item) => {
    const incrementRetweetCount = n =>
      n.id === item.id ? { ...n, retweets: item.retweets + 1 } : n;

    return {
      buffer: state.buffer,
      items: [...state.items.map(incrementRetweetCount)]
    };
  };

  const handleLike = (state, item) => {
    const toggleLike = n => (n.id === item.id ? { ...n, liked: !n.liked } : n);

    return {
      buffer: state.buffer,
      items: [...state.items.map(toggleLike)]
    };
  };

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'LOADING':
          return;
        case 'FIRST_DATA_RECEIVED':
          return { buffer: [], items: action.payload };
        case 'DATA_RECEIVED':
          return { buffer: [...action.payload, ...state.buffer], items: state.items };
        case 'INCREMENT_RETWEET':
          // Making our functions pure
          return handleRetweet(state, action.payload);
        case 'TOGGLE_LIKE':
          return handleLike(state, action.payload);
        case 'ADD_TO_LIST':
          return addToItems(state);
        default:
          return state;
      }
    },
    {
      items: [],
      // We place the new tweets on a buffer
      buffer: [],
      loading: true
    }
  );

  // const [state, setState] = useState({
  //   items: MockTimelineService.getTimelineData(),
  //   // We place the new tweets on a buffer
  //   buffer: []
  // });

  const onDataReceived = payload => {
    if (!state.items.length) dispatch({ type: 'FIRST_DATA_RECEIVED', payload });
    else dispatch({ type: 'DATA_RECEIVED', payload });
    document.title = `(${state.buffer ? state.buffer.length + 1 : ''}) React App`;
  };

  useEffect(() => {
    const timelineSubscription = MockTimelineService.twatTimeline$().subscribe(onDataReceived);

    // Clean up subscription on did unmount
    return () => {
      timelineSubscription.unsubscribe();
    };
  }, [state.buffer, state.items]);

  return (
    <Fragment>
      {state.loading ? (
        <h1 style={{ textAlign: 'center' }}>Loading Twats</h1>
      ) : (
        state.buffer.length > 0 && (
          <button onClick={() => dispatch({ type: 'ADD_TO_LIST' })}>
            {state.buffer.length} new twats
          </button>
        )
      )}
      {state.items.map((item, k) => (
        // dispatch is just a function we can pass around
        <TimelineItem key={k} item={item} dispatch={dispatch} />
      ))}
    </Fragment>
  );
};

export default Timeline;
