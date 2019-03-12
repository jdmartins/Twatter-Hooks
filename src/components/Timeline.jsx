import React, { useEffect, useState, Fragment } from 'react';
import TimelineItem from './TimelineItem';
import MockTimelineService from '../service/timeline/mock/MockTimelineService';

const Timeline = () => {
  const [state, setState] = useState({
    items: MockTimelineService.getTimelineData(),
    // We place the new tweets on a buffer
    buffer: []
  });

  useEffect(() => {
    const timelineSubscription = MockTimelineService.timeline$().subscribe(data => {
      setState({ buffer: [data, ...state.buffer], items: state.items });
      document.title = `(${state.buffer ? state.buffer.length + 1 : ''}) React App`;
    });

    // Clean up subscription on did unmount
    return () => {
      timelineSubscription.unsubscribe();
    };
  }, [state.buffer, state.items]);

  const addToItems = () => {
    // still impure
    // empty the buffer and place the new items on the array
    setState({ items: [...state.buffer, ...state.items], buffer: [] });
    // scroll to top

    window.scrollTo(0, 0);
  };

  const handleRetweet = item => {
    const incrementRetweetCount = n =>
      n.id === item.id ? { ...n, retweets: item.retweets + 1 } : n;

    setState({
      buffer: state.buffer,
      items: [...state.items.map(incrementRetweetCount)]
    });
  };

  const handleLike = item => {
    const toggleLike = n => (n.id === item.id ? { ...n, liked: !n.liked } : n);

    setState({
      buffer: state.buffer,
      // Performance not so great we need to map all over the list O(N)
      items: [...state.items.map(toggleLike)]
    });
  };

  return (
    <Fragment>
      {state.buffer.length > 0 && (
        <button onClick={addToItems}>{state.buffer.length} new Messages</button>
      )}
      {state.items.map((item, k) => (
        <TimelineItem key={k} item={item} handleLike={handleLike} handleRetweet={handleRetweet} />
      ))}
    </Fragment>
  );
};

export default Timeline;
