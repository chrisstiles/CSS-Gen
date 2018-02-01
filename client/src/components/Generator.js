import React from 'react';
import Header from './Header';

const Generator = props => {
  return (
    <div id="generator-wrapper">
      <Header title={props.title} />
      <div id="generator" class="page-content">
        {props.children}
      </div>
    </div>
  );
}

export default Generator;