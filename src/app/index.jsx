import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory, hashHistory} from 'react-router';

import MissingPage from './missing.jsx';
import SendMoney from './sendmoney.jsx';
import TransactionHistory from './history.jsx';
class MainPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="main-frontpage">
        <header><p>What are we Doing?</p></header>
        <div className="frontpage">
          <Link to='/transfer'><button className="front-btn">Send Money</button></Link>
          <Link to='/history'><button className="front-btn">View Transaction History</button></Link>
        </div>
        <footer></footer>

      </div>
      )
  }
}






render(
  <Router history={hashHistory}>
    <Route path="/" component={MainPage} />
    <Route path="/transfer" component={SendMoney} />
    <Route path="/history" component={TransactionHistory} />
    <Route path='*' component={MissingPage} />
  </Router>, 
  document.getElementById('app')
);