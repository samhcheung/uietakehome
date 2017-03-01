import React from 'react';
import {Link} from 'react-router';


class MissingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <header><p>404</p></header>
        <div>404 not found</div>
        <footer>
          <Link to='/'><button>Back</button></Link>
        </footer>
      </div>
      )
  }
}


export default MissingPage;
