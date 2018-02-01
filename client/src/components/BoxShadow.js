import React from 'react';
import Generator from './Generator';
import Sidebar from './Sidebar';

const BoxShadow = () => {
  document.title = 'CSS Box Shadow Generator | CSS-GEN';

  return (
    <Generator title="CSS Box Shadow Generator">
      <p>This is our content</p>
      <Sidebar>
        hello
      </Sidebar>
    </Generator>
  );
}

export default BoxShadow;