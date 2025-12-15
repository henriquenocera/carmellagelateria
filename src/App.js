import './App.css';
import logo from './assets/logo.svg';
import produto from './assets/waffle-nutella-morango.jpg'


function App() {
  return (

    <>
      <div className='container'>
      <img src={logo} className="App-logo" alt="logo" />
      <h2 className='title-h2'>Faça seu pedido abaixo</h2>
      <p className='text'>Horário de funcionamento: <br></br> Seg - Sáb | 12:00 às 19:00 | </p>
      <h3 className='title-h3'>Cardápio de Delivery</h3>
      <div className='container-produtos'>
        <div className='produto'>
          <img src={produto} className="produto-img" alt="produto" />
          <h4 className='produto-title'>Waffle de Nutella com Morango</h4>
          <p className='produto-description'>Massa de waffle de liège com Nutella e morangos</p>
          <p className='produto-price'>R$ 20,00</p>
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
