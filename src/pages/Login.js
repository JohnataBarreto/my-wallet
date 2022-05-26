import PropTypes from 'prop-types';
import React from 'react';
import './Login.css';
import { connect } from 'react-redux';
import clickButton from '../actions/userUpdate';
import { EMAIL_INPUT_TEST_ID, PASSWORD_INPUT_TEST_ID } from '../tests/helpers/constants';
import WalettImage from '../wallet.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      senha: '',
      email: '',
    };
  }

  handleChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    }, () => this.validateForm());
  };

  ValidateEmail = (mail) => {
    if (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true);
    }
    return (false);
  }

  validateForm = () => {
    const {
      senha,
      email,
    } = this.state;
    if (senha.length >= '6' && this.ValidateEmail(email) === true) {
      this.setState({ disabled: false });
    }
    if (senha.length < '6' || this.ValidateEmail(email) === false) {
      this.setState({ disabled: true });
    }
  };

  onClickButton = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { userLog } = this.props;
    userLog(email);
    this.redirect();
  };

  redirect = () => {
    const { history } = this.props;
    history.push('/carteira');
  }

  render() {
    const {
      disabled,
    } = this.state;

    return (
      <>
        <form>
          <section>
            <label htmlFor="email">
              E-mail
              {''}
              <input
                type="email"
                class="input"
                data-testid={ EMAIL_INPUT_TEST_ID }
                onChange={ this.handleChange }
                name="email"
                placeholder='digite seu e-mail'
              />
            </label>
            <label htmlFor="senha">
              senha
              {''}
              <input
                type="password"
                class="input"
                data-testid={ PASSWORD_INPUT_TEST_ID }
                onChange={ this.handleChange }
                name="senha"
                placeholder='digite sua senha'

              />
            </label>
          </section>
          <button
            type="button"
            disabled={ disabled }
            onClick={ this.onClickButton }
          >
            Entrar
          </button>
        </form>
        <div class="capa">
          <h1>
            Carteira digital
          </h1>
          <img
            src={ WalettImage }
            alt='wallet'
          />
          <h3>
            Essa é a sua carteira digital. Nela voçê vai grenciar seus gastos e otimizar seus recursos em qualquer lugar do mundo. 
          </h3>
        </div>
        
      </>
    );
  }
}

Login.propTypes = {
  userLog: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (Store) => ({
  user: Store.user.email,
  wallet: {
    currencies: Store.wallet.currencies,
    expenses: Store.wallet.expenses,
  },
});

const mapDispatchToProps = (dispatch) => ({
  userLog: (email) => dispatch(clickButton(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
