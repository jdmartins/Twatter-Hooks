import React from 'react';

const toReadableDate = timestamp => {
  const d = new Date(timestamp);
  const formattedDate = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
  const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  const formattedTime = hours + ':' + minutes;

  return formattedDate + ' ' + formattedTime;
};

const TimelineItem = ({ item, dispatch }) => (
  <div className="tweet">
    <div className="tweet--user">
      <img className="tweet--user-avatar" src={item.avatar} alt="" />
      <div className="tweet--user-name">{item.ip}</div>
    </div>

    <p className="tweet--body">{item.content}</p>

    <div className="tweet--time">{toReadableDate(item.date)}</div>

    <div className="tweet--actions">
      <i
        onClick={() => dispatch({ type: 'TOGGLE_LIKE', payload: item })}
        className={`fa fa-heart ${item.liked}`}
      />
      <i
        onClick={() => dispatch({ type: 'INCREMENT_RETWEET', payload: item })}
        className="fa fa-retweet"
      />
      <span>{item.retweets} retweets</span>
    </div>
  </div>
);

export default TimelineItem;
