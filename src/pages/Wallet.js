import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import currencyBRLApi from '../Currenses/cotacoes';
import checkCurrenci from '../actions/WalletUpdate';
import saveExpenses from '../actions/expensesUpdate';
import saveSum from '../actions/sumUdate';
import deleteExpenses from '../actions/deletExpense';
import deletSum from '../actions/SumDowgrade';

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
    });
  }

  async componentDidMount() {
    const { currUp } = this.props;
    const data = Object.values(await currencyBRLApi());
    const data2 = data.filter((item) => item.codein === 'BRL');
    const saida = data2.map((item) => item.code);
    currUp(saida);
  }

  handleChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
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
    const { expUp, sumUp } = this.props;
    const { expenses, valor, total, contagem } = this.state;
    const expense = await this.criatExpense();
    expenses.push(expense);
    const cot = expense.currency;
    const exchangeRate = Object.values(expense.exchangeRates);
    const rate = exchangeRate.find((item) => item.code === cot);
    const valor1 = +valor * rate.ask;
    const soma = total + valor1;
    const contador = (contagem + 1);
    this.setState({ total: soma, contagem: contador });
    expUp(expenses);
    sumUp(soma);
    this.setState({ valor: '', descricao: '', corrente: '', metodo: '', tipo: '' });
    console.log(rate);
    console.log(cot);
  }

  deleteExpense = async ({ target }) => {
    const deletId = target.id;
    const { delExp, wallet, sumDow } = this.props;
    const { total, contagem } = this.state;
    const exp = wallet.expenses;
    const expenses = await exp.filter((expense) => +expense.id !== +deletId);
    delExp(expenses);
    const sum = await exp.filter((expense) => +expense.id === +deletId);
    const soma = total - sum[0].value;
    const contador = (contagem - 1);
    this.setState({ total: soma, contagem: contador });
    sumDow(soma);
  }

  render() {
    const { user, wallet } = this.props;
    const { total, valor, descricao, corrente, metodo, tipo } = this.state;
    const currencie = wallet.currencies;
    const expense = wallet.expenses;
    return (
      <>
        <header>
          <div data-testid="email-field">
            E-mail:
            {''}
            { user }
          </div>
          <div data-testid="total-field">
            { total.toFixed(2) }
          </div>
          <div data-testid="header-currency-field">
            BRL
          </div>
        </header>
        <form>
          <input
            type="number"
            data-testid="value-input"
            onChange={ this.handleChange }
            name="valor"
            id="valor"
            value={ valor }
          />
          <input
            type="text"
            data-testid="description-input"
            onChange={ this.handleChange }
            name="descricao"
            value={ descricao }
          />
          <label htmlFor="moeda">
            Moeda:
            <select
              data-testid="currency-input"
              name="corrente"
              id="moeda"
              onChange={ this.handleChange }
              value={ corrente }
            >
              {currencie.map((item, index) => (
                <option
                  key={ index }
                  value={ item }
                >
                  { item }
                </option>))}
            </select>
          </label>
          <select
            data-testid="method-input"
            name="metodo"
            onChange={ this.handleChange }
            value={ metodo }
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Cartão de débito">Cartão de débito</option>
          </select>
          <select
            data-testid="tag-input"
            name="tipo"
            onChange={ this.handleChange }
            value={ tipo }
          >
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
          </select>
          <button
            type="button"
            onClick={ this.clickExpencisUpdate }
          >
            Adicionar despesa
          </button>
        </form>
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
              <th>Editar/Excluir</th>
            </tr>
            {
              expense.map((item) => (
                <tr key={ item.id } id={ item.id }>
                  <td>{ item.description }</td>
                  <td>{ item.tag }</td>
                  <td>{ item.method }</td>
                  <td>{ (+item.value).toFixed(2) }</td>
                  <td>{ item.name }</td>
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
  sumUp: (soma) => dispatch(saveSum(soma)),
  sumDow: (soma) => dispatch(deletSum(soma)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
