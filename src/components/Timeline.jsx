import React, { Fragment } from 'react';
import TimelineItem from './TimelineItem';
import MockTimelineService from '../service/timeline/mock/MockTimelineService';

class Timeline extends React.Component {
  timelineSubscription = null;
  state = {
    items: MockTimelineService.getTimelineData(),
    // We place the new tweets on a buffer
    buffer: []
  };

  componentDidMount() {
    this.timelineSubscription = MockTimelineService.timeline$().subscribe(data => {
      this.setState({ buffer: [data, ...this.state.buffer], items: this.state.items });
      document.title = `(${this.state.buffer ? this.state.buffer.length + 1 : ''}) React App`;
    });
  }

  componentWillUnmount() {
    this.timelineSubscription.unsubscribe();
  }

  addToItems = () => {
    // empty the buffer and place the new items on the array
    this.setState({ items: [...this.state.buffer, ...this.state.items], buffer: [] });
    // scroll to top

    window.scrollTo({ top: 0 });
  };

  handleRetweet = item => {
    const incrementRetweetCount = n =>
      n.id === item.id ? { ...n, retweets: item.retweets + 1 } : n;

    this.setState({
      buffer: this.state.buffer,
      items: [...this.state.items.map(incrementRetweetCount)]
    });
  };

  handleLike = item => {
    const toggleLike = n => (n.id === item.id ? { ...n, liked: !n.liked } : n);

    this.setState({
      buffer: this.state.buffer,
      // Performance not so great we need to map all over the list O(N)
      items: [...this.state.items.map(toggleLike)]
    });
  };

  render() {
    return (
      <Fragment>
        {this.state.buffer.length > 0 && (
          <button onClick={this.addToItems}>{this.state.buffer.length} new Messages</button>
        )}
        {this.state.items.map((item, k) => (
          <TimelineItem
            key={k}
            item={item}
            handleLike={this.handleLike}
            handleRetweet={this.handleRetweet}
          />
        ))}
      </Fragment>
    );
  }
}

export default Timeline;
