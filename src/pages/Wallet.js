import React from 'react';
import './Wallet.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import currencyBRLApi from '../Currenses/cotacoes';
import checkCurrenci from '../actions/WalletUpdate';
import saveExpenses from '../actions/expensesUpdate';
import deleteExpenses from '../actions/deletExpense';
import {
  AiFillLinkedin,
  AiFillMail,
  AiOutlineGithub,
} from "react-icons/ai";
import { GiEasterEgg } from "react-icons/gi";

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = ({
      contagem: 0,
      valor: '',
      descricao: '',
      corrente: '',
      metodo: '',
      tipo: '',
      expenses: [],
      total: 0,
      disabled: true,
    });
  }


  async componentDidMount() {
    const { currUp } = this.props;
    const data = Object.values(await currencyBRLApi());
    const data2 = data.filter((item) => item.codein === 'BRL');
    const saida = data2.map((item) => item.code);
    currUp(saida);
  }

  chandDisabled = () => {
    const {
      valor,
      corrente,
    } = this.state;
    if (valor > 0 && corrente) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true })
    }
  }

  chandValue = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  handleChange = async ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    await this.chandValue(name, value);
    this.chandDisabled()
  };

  criatExpense = async () => {
    const { contagem, valor, descricao, corrente, metodo, tipo } = this.state;
    const expense = {
      id: contagem,
      value: valor,
      description: descricao,
      currency: corrente,
      method: metodo,
      tag: tipo,
      exchangeRates: await currencyBRLApi(),
    };
    return expense;
  };

  clickExpencisUpdate = async (event) => {
    event.preventDefault();
    const { expUp } = this.props;
    const { expenses, contagem } = this.state;
    const expense = await this.criatExpense();
    const exp = [...expenses, expense];
    const contador = (contagem + 1);
    this.setState({ contagem: contador, expenses: exp  });
    expUp(exp);
    this.setState({ valor: '', descricao: '', corrente: '', metodo: '', tipo: '', disabled: true });
  }

  deleteExpense = async ({ target }) => {
    const deletId = target.id;
    const { delExp, wallet } = this.props;
    const { contagem } = this.state;
    const exp = wallet.expenses;
    const expenses = await exp.filter((expense) => +expense.id !== +deletId);
    delExp(expenses);
    const contador = (contagem - 1);
    this.setState({ contagem: contador });
    console.log(expenses);
  }

  sum = (expense) => { 
    if (expense.length !== 0) {
      return (
        <span>
          {
            expense.map((item) => (
            ((+item.value)
              * (+item.exchangeRates[item.currency].ask)).toFixed(2)
              )).reduce((soma, i) => +soma + +i)
          }
        </span>
      )
    } else {
      return (<span>0,00</span>)
    }
  }

  render() {
    const { user, wallet } = this.props;
    const { valor, descricao, corrente, disabled, metodo, tipo } = this.state;
    const currencie = wallet.currencies;
    const expense = wallet.expenses;
    return (
      <>
        <header
          class="header"
        >
          <span data-testid="email-field">
            USUÁIO:
            {''}
            { user }
          </span>
          <span>
            TOTAL GASTO R$
            {''}
            {this.sum(expense)}
          </span>
        </header>
        <form>
          <label>
            Valor da despesa: 
            <input
              type="number"
              class="inputs"
              data-testid="value-input"
              onChange={ this.handleChange }
              name="valor"
              id="valor"
              value={ valor }
              placeholder="Digite o valor"
              min={ 0 }
            />
          </label>
          <label htmlFor="moeda">
            Moeda:
            <select
              data-testid="currency-input"
              class="inputs"
              name="corrente"
              id="moeda"
              onChange={ this.handleChange }
              value={ corrente }
            >
              <option value="" disabled selected>Selecione...</option>
              {currencie.map((item, index) => (
                <option
                  key={ index }
                  value={ item }
                >
                  { item }
                </option>))}
            </select>
          </label>
          <label>
            Forma de pagamento:
            <select
              data-testid="method-input"
              class="inputs"
              name="metodo"
              onChange={ this.handleChange }
              value={ metodo }
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>
          <label>
            Tipo da despesa:
            <select
              data-testid="tag-input"
              class="inputs"
              name="tipo"
              onChange={ this.handleChange }
              value={ tipo }
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>
          <label>
            Descrição:
            <input
              type="text"
              class="inputs"
              data-testid="description-input"
              onChange={ this.handleChange }
              name="descricao"
              value={ descricao }
              placeholder="Digite aqui"
            />
          </label>
          <button
            type="button"
            onClick={ this.clickExpencisUpdate }
            disabled={ disabled }
          >
            Adicionar despesa
          </button>
        </form>
        <fieldset class="fundo">
          <table>
            <tbody>
              <tr>
                <th>Descrição</th>
                <th>Tag</th>
                <th>Método de pagamento</th>
                <th>Valor </th>
                <th>Moeda</th>
                <th>Câmbio utilizado</th>
                <th>Valor convertido</th>
                <th>Moeda de conversão</th>
                <th>Excluir</th>
              </tr>
              {
                expense.map((item) => (
                  <tr
                    key={ item.id }
                    name={ (+item.exchangeRates[item.currency].ask).toFixed(2) }
                  >
                    <td>{ item.description }</td>
                    <td>{ item.tag }</td>
                    <td>{ item.method }</td>
                    <td>{ (+item.value).toFixed(2) }</td>
                    <td>{ item.exchangeRates[item.currency].name }</td>
                    <td>{ (+item.exchangeRates[item.currency].ask).toFixed(2) }</td>
                    <td>
                      { ((+item.value)
                    * (+item.exchangeRates[item.currency].ask)).toFixed(2) }
                    </td>
                    <td>Real</td>
                    <td>
                      <button
                        type="button"
                        id={ item.id }
                        data-testid="delete-btn"
                        onClick={ this.deleteExpense }
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </fieldset>
        <footer
          class="footer"
        >
          <a
          href='johnatabarreto@hotmail.com'
          className='icon'
          target='_blank'
          >
            <AiFillMail />
          </a>
          <a
          href='https://github.com/JohnataBarreto'
          className='icon'
          target='_blank'
          >
            <AiOutlineGithub />
          </a>
          <a
          href='https://www.linkedin.com/in/johnata-barreto/'
          className='icon'
          target='_blank'
          >
            <AiFillLinkedin />
          </a>
          <a
          href='http://www.atari2600.com.br/Sites/Atari/AtariFull.aspx'
          className='icon'
          target='_blank'
          >
            <GiEasterEgg />
          </a>
        </footer>
      </>
    );
  }
}

const mapStateToProps = (Store) => ({
  user: Store.user.email,
  wallet: {
    currencies: Store.wallet.currencies,
    expenses: Store.wallet.expenses,
  },
});

Wallet.propTypes = {
  user: PropTypes.string.isRequired,
  currUp: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf.isRequired,
  wallet: PropTypes.objectOf.isRequired,
  expUp: PropTypes.func.isRequired,
  delExp: PropTypes.func.isRequired,
  sumUp: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf.isRequired,
  sumDow: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  currUp: (currencies) => dispatch(checkCurrenci(currencies)),
  expUp: (expenses) => dispatch(saveExpenses(expenses)),
  delExp: (expenses) => dispatch(deleteExpenses(expenses)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
