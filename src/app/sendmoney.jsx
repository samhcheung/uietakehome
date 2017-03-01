import React from 'react';
import {Link} from 'react-router';


class SendMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = {recipient: '', 
                  amount: '', 
                  currencyType: 'USD', 
                  message: '', 
                  sendFriend: false, 
                  payServices: false, 
                  emailValidation: false, 
                  loading: false, 
                  success: false
                };
    //Handle input states
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleAmount = this.handleAmount.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleCurrencyType = this.handleCurrencyType.bind(this);
    this.clickPaymentType = this.clickPaymentType.bind(this);

    //Validation and formatting
    this.validateEmail = this.validateEmail.bind(this);
    this.formatAmount = this.formatAmount.bind(this);
    this.simplifyAmount = this.simplifyAmount.bind(this);

    //Switching formats for amount view
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    //Button methods
    this.clearForm = this.clearForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleRecipient(event) {
    this.validateEmail(event.target.value);
    this.setState({recipient: event.target.value});
  }
  handleAmount(event) {
    this.setState({amount: event.target.value});
  }
  handleMessage(event) {
    this.setState({message: event.target.value});
  }
  handleCurrencyType(event) {
    this.setState({
                    amount: '',
                    currencyType: event.target.value
                  });
  }
  validateEmail(email) {
    let regex = /\S+\@\w+\.\S+/ ;
    this.setState({emailValidation: regex.test(email) });
  }
  clickPaymentType(event) {
    if(event.currentTarget.id === "friend") {
      this.setState({
                      sendFriend: true,
                      payServices: false
                    });
    } else if (event.currentTarget.id === "service"){
      this.setState({
                      sendFriend: false,
                      payServices: true
                    });
    }
  }
  formatAmount(amount) {
    const currencyType = this.state.currencyType;
    let regex = undefined;
    let formattedResult = '';
    
    if(currencyType === 'USD' || currencyType === 'EUR') {
      regex = /^(?=.*[1-9])\d*(?:\.\d*)?$/;
    } else if(currencyType === 'JPY') {
      regex = /^[1-9]\d*$/;
    }
    //Match the format of the regex and store value 
    formattedResult = amount.match(regex) ? amount.match(regex)[0] : '';
    
    //If not JPY, format with decimals
    if(formattedResult && currencyType !== 'JPY') {
      formattedResult = Number(formattedResult).toFixed(2);
    }
    //Add commas for every thousand left of decimal point
    let parts = formattedResult.split('.');
    let result = '';
    let i = parts[0].length - 3;
    while(i > 0) {
      result = ',' + parts[0].substr(i, 3) + result;
      i-=3;
    }
    parts[0] = parts[0].substr(0,i+3) + result;
    formattedResult = parts.join('.')
    

    return formattedResult;
  }

  simplifyAmount(amount) {
    let result = '';
    result = amount.replace('.00','').replace(/,/g,'');
    return result;
  }

  handleBlur(event) {
    const formattedvalue = this.formatAmount(this.state.amount);
    this.setState({amount: formattedvalue});
  }
  handleFocus(event) {
    const simplifiedValue = this.simplifyAmount(this.state.amount);
    this.setState({amount: simplifiedValue});
  }


  clearForm() {
    this.setState({
                    recipient: '',
                    amount: '',
                    currencyType: 'USD',
                    message: '',
                    sendFriend: false,
                    payServices: false,
                    emailValidation: false,
                    loading: false,
                    success: false
                  });
  }
  submitForm() {
    const amount = this.state.amount;
    const simplifiedValue = this.simplifyAmount(amount);
    
    if(!this.state.emailValidation) {
      alert('Invalid email');
    } else if (+simplifiedValue <= 0) {
      alert('Please enter an amount greater than zero');
    } else if (!this.state.sendFriend && !this.state.payServices) {
      alert('Please select what the payment is for');
    } else {
      this.setState({loading: true});

      //simulate callback for sending data
      setTimeout( () => {
        this.setState({
                        loading: false, 
                        success: true
                      });

      }, 1000);

    }
  }



  render () {
    const emailValidated = this.state.emailValidation;
    const currencyType = this.state.currencyType;
    const sendFriend = this.state.sendFriend;
    const payServices = this.state.payServices;
    const success = this.state.success;

    const toSymbol = {
      'USD': '$',
      'JPY': '¥',
      'EUR': '€'
    };
    let symbol = toSymbol[currencyType];

    return (
      <div className="main-sendmoney">
        <div className="sendmoney-form">

          {this.state.loading && 
            <div className="overlay"><img className="spinner" src="spinner.gif" /></div>
          }

          <header><p>Send Money</p></header>


          {!this.state.success && 
            <div className="send-money">
              <div className="input-box">
                <label>
                  To: 
                  <input required value={this.state.recipient} onChange={this.handleRecipient} />
                  {this.state.emailValidation && <span className="inline-checkmark">✓</span>}
                </label>
              </div>

              <div className="input-box">
                <label>
                  Amount: {symbol}
                  <input required value={this.state.amount} onChange={this.handleAmount} onBlur={this.handleBlur} onFocus={this.handleFocus} />
                  <select value={this.state.currencyType} onChange={this.handleCurrencyType}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </label>
              </div>

              <div className="input-box">
                <label className="message-box">
                  Message (optional):
                  <textarea rows="3" type="text" value={this.state.message} onChange={this.handleMessage}></textarea>
                </label>
              </div>
              <div>What's this payment for?</div>
              <div className="input-box payment-type">
                <div id="friend" className={"payment-option" + " " + (sendFriend ? 'active' : '')} onClick={this.clickPaymentType}>
                  <span>I'm sending money to family or friends</span>
                  {sendFriend && <span className="inline-checkmark">✓</span>}
                </div>
                <div id="service" className={"payment-option" + " " + (payServices ? 'active' : '')} onClick={this.clickPaymentType}>
                  <span>I'm paying for goods or services</span>
                  {payServices && <span className="inline-checkmark">✓</span>}
                </div>
              </div>
            </div>
          }

          {this.state.success && 
            <div className="send-money">
              <p className="success-msg">{`You have sent ${symbol}${this.state.amount} ${this.state.currencyType} to ${this.state.recipient}!`}</p>
              <p className="success-checkmark">✓</p>
            </div>
            
          }

          <footer>
            {this.state.success && 
              <div className="footer-btns">
                <button className="success-btn" onClick={this.clearForm}> Send Money</button>
                <Link to='/history'><button className="success-btn">Transaction History</button></Link>
              </div>
            }
            {!this.state.success && 
              <div className="footer-btns">
                <button className="send-form-btn" onClick={this.clearForm}>Clear</button>
                <button className="send-form-btn" onClick={this.submitForm}>Next</button>
              </div>
            }
          </footer>

        </div>  
      </div>
    )
  }
}

export default SendMoney;


