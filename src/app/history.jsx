import React from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import _ from 'underscore';

class TransactionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                    history: [],
                    page: 0
    }
    this.handleScroll = _.debounce(this.handleScroll, 500).bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount () {
    this.loadMore();
    
  }
  handleScroll(event) {
    const scroll = this.refs.scrollcontainer;
    const height = scroll.scrollHeight;
    const top = scroll.scrollTop;
    const visibleArea = scroll.clientHeight;
    if(top + visibleArea === height) {
      this.loadMore();
    }
  }
  loadMore () {
    console.log('loading more')
      axios.get(`/api/history?page=${this.state.page}`)
      .then(response => {
        const history = this.state.history.slice();
        const newhistory = history.concat(response.data);
        this.setState({history: newhistory});
        this.setState({page: this.state.page + 1})
      });
  }
  render () {
    const toSymbol = {
      'USD': '$',
      'JPY': '¥',
      'EUR': '€'
    }

    return (
      <div>
        <header><p>Transaction History</p></header>
        <div className="transaction-container" ref="scrollcontainer" onScroll={this.handleScroll}>
          <div className="transaction-list" >
            {this.state.history.map(item =>
              <div className="transaction-item" key={item.id}>
                <p>{new Date(item.date).toLocaleDateString()}</p>
                <p>{item.recipient}</p>
                {item.currencyType !== 'JPY' ?
                <p>{toSymbol[item.currencyType]}{Number(item.amount).toFixed(2)}</p> :
                <p>{toSymbol[item.currencyType]}{(item.amount)}</p>}
              </div>
            )}
          </div>
        </div>
        <footer>
          <Link to='/'><button className="back-btn">Back</button></Link>
        </footer>
      </div>
      )
  }
}

export default TransactionHistory;