import { useMemo, useState } from 'react';
import './App.css';
import logo from './assets/logo.svg';
import nutellaemorango from './assets/waffle-nutella-morango.jpg';
import doceebanana from './assets/waffle-doce-banana.jpg';

const PHONE_NUMBER = '5541988681152'; // atualize com seu número no formato DDI+DDD+telefone

const PRODUCTS = [
  {
    id: 'waffle-nutella-morango',
    name: 'Waffle de Nutella com Morango',
    description: 'Massa de waffle de liège com Nutella e Morangos',
    price: 20,
    image: nutellaemorango,
  },
  {
    id: 'waffle-doce-banana',
    name: 'Waffle de Doce de Leite com Banana',
    description: 'Massa de waffle de liège com Doce de Leite e Bananas',
    price: 18,
    image: doceebanana,
  },
  // Adicione mais produtos aqui se necessário
];

function App() {
  const [quantities, setQuantities] = useState(
    PRODUCTS.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {}),
  );
  const [cart, setCart] = useState([]);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(0, Math.min(99, Number(value) || 0));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const handleAdd = (product) => {
    const quantity = quantities[product.id];
    if (!quantity) return;

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const whatsappText = useMemo(() => {
    if (!cart.length) return '';

    const itemsText = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(
            2,
          )} (Subtotal: R$ ${(item.price * item.quantity).toFixed(2)})`,
      )
      .join('\n');

    return `Olá! Gostaria de fazer o seguinte pedido:\n${itemsText}\nTotal: R$ ${total.toFixed(
      2,
    )}`;
  }, [cart, total]);

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <>
      <div className="container">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="title-h2">Faça seu pedido abaixo</h2>
        <p className="text">
          Horário de funcionamento: <br /> Seg - Sáb | 12:00 às 19:00 |
        </p>
        <h3 className="title-h3">Cardápio de Delivery</h3>

        <form>
          {PRODUCTS.map((product) => (
            <div className="container-produtos" key={product.id}>
              <div className="produto">
                <img
                  src={product.image}
                  className="produto-img"
                  alt={product.name}
                />
                <h4 className="produto-title">{product.name}</h4>
                <p className="produto-description">{product.description}</p>
                <p className="produto-price">
                  R$ {product.price.toFixed(2)}
                </p>
                <div className="container-2">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={quantities[product.id] ?? 0}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="produto-qntd"
                  />
                  <button
                    type="button"
                    className="produto-btn"
                    onClick={() => handleAdd(product)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              

            </div>
          ))}
        </form>

        <div className="cart">
          <h3 className="title-h3">Seu carrinho</h3>
          {!cart.length ? (
            <p className="text">Nenhum item adicionado ainda.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="produto-btn remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <strong>Total:</strong> R$ {total.toFixed(2)}
              </div>
              
            </>
          )}
        </div>
        <a
                className="produto-btn"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!cart.length}
              >
                Enviar pedido pelo WhatsApp
              </a>

      </div>
    </>
  );
}

export default App;
