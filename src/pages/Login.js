import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import clickButton from '../actions/userUpdate';
import { EMAIL_INPUT_TEST_ID, PASSWORD_INPUT_TEST_ID } from '../tests/helpers/constants';

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
      <form>
        <label htmlFor="email">
          <input
            type="email"
            data-testid={ EMAIL_INPUT_TEST_ID }
            onChange={ this.handleChange }
            name="email"
          />
        </label>
        <label htmlFor="senha">
          <input
            type="password"
            data-testid={ PASSWORD_INPUT_TEST_ID }
            onChange={ this.handleChange }
            name="senha"
          />
        </label>
        <button
          type="button"
          disabled={ disabled }
          onClick={ this.onClickButton }
        >
          Entrar
        </button>
      </form>
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
