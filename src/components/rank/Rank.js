import React from 'react';


const Rank = ({name, entries}) => {
    return (
      <div>
        <h1 className= 'white f1'>Face Finder</h1>
        <div className='white f3'>
          {`${name} , your current entry count is ...`}
        </div>
        <div className='white f1'>
          {entries}
        </div>
      </div>  
    );
}

export default Rank;