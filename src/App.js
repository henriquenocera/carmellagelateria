import { useMemo, useState } from 'react';
import './App.css';
import logo from './assets/logo.svg';
import nutellaemorango from './assets/waffle-nutella-morango.jpg';
import doceebanana from './assets/waffle-doce-banana.jpg';
import pote from './assets/pote.png';

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
  {
    id: 'pote',
    name: 'Pote 480ml',
    description: 'Escolha seus sabores',
    price: 44.9,
    image: pote,
  },
  // Adicione mais produtos aqui se necessário
];

function App() {
  const [quantities, setQuantities] = useState(
    PRODUCTS.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {}),
  );
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [customer, setCustomer] = useState({ name: '', phone: '', cep: '' });

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(0, Math.min(99, Number(value) || 0));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  // store selection for Pote 480ml
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [pendingPote, setPendingPote] = useState(null);
  const [selectedStore, setSelectedStore] = useState('');
  // stores with keys matching the sabor site paths
  const STORES = [
    { key: 'ahu', name: 'Ahu' },
    { key: 'altoxv', name: 'Alto XV' },
  ];

  // flavor selection state
  const [showFlavorSelector, setShowFlavorSelector] = useState(false);
  const [flavorOptions, setFlavorOptions] = useState([]);
  const [flavorsLoading, setFlavorsLoading] = useState(false);
  const [flavorsError, setFlavorsError] = useState('');
  const [selectedFlavors, setSelectedFlavors] = useState([]);

  // Trello config for alternate flavor source
  // Trello config for alternate flavor source
  // Detect from environment (CRA requires REACT_APP_ prefix)
  const envTrelloKey = process.env.REACT_APP_TRELLO_KEY || '';
  const envTrelloToken = process.env.REACT_APP_TRELLO_TOKEN || '';
  const envTrelloAhu = process.env.REACT_APP_TRELLO_LIST_AHU || '';
  const envTrelloAltoxv = process.env.REACT_APP_TRELLO_LIST_ALTOXV || '';

  const [trelloKey, setTrelloKey] = useState(envTrelloKey);
  const [trelloToken, setTrelloToken] = useState(envTrelloToken);
  const [trelloLists, setTrelloLists] = useState({ ahu: envTrelloAhu, altoxv: envTrelloAltoxv });

  // fetch flavors for a given store key
  const fetchFlavorsForStore = async (storeKey) => {
    console.debug('fetchFlavorsForStore called for', storeKey, { trelloKey, trelloToken, trelloLists });
    setFlavorsLoading(true);
    setFlavorsError('');
    setFlavorOptions([]);
    try {
      // If Trello config is present and a listId is supplied for this store, prefer Trello
      const listId = trelloLists[storeKey];
      if (trelloKey && trelloToken && listId) {
        try {
          const trelloUrl = `https://api.trello.com/1/lists/${listId}/cards?fields=name&key=${encodeURIComponent(
            trelloKey,
          )}&token=${encodeURIComponent(trelloToken)}`;
          const trelloRes = await fetch(trelloUrl);
          if (trelloRes.ok) {
            const cards = await trelloRes.json();
            const names = (cards || []).map((c) => c.name).filter(Boolean);
            if (names.length) {
              setFlavorOptions(names);
              setShowFlavorSelector(true);
              setShowStoreSelector(false);
              setFlavorsLoading(false);
              return;
            }
          } else {
            setFlavorsError('Erro ao acessar Trello: ' + trelloRes.status);
          }
        } catch (err) {
          setFlavorsError('Erro ao acessar Trello.');
        }
      }

      // Removed scraping fallback to sabores.carmellagelateria.com.br
      // We now require Trello configuration for flavors. Inform the user.
      setFlavorsError('Nenhuma fonte de sabores configurada para esta loja. Por favor, configure Trello (List ID) para esta loja.');
      return;
    } catch (err) {
      setFlavorsError('Erro ao buscar sabores. Tente novamente.');
    } finally {
      setFlavorsLoading(false);
    }
  };

  // click wrapper to help debugging when user clicks the "Próximo" button
  const handleFetchFlavorsClick = () => {
    console.debug('handleFetchFlavorsClick, selectedStore=', selectedStore);
    if (!selectedStore) return;
    fetchFlavorsForStore(selectedStore).catch((err) => {
      console.error('fetchFlavorsForStore error', err);
      setFlavorsError('Erro ao buscar sabores. Veja o console para mais detalhes.');
    });
  };

  const handleSelectStore = (sKey) => {
    setSelectedStore(sKey);
    console.debug('handleSelectStore, triggering fetch for', sKey);
    fetchFlavorsForStore(sKey).catch((err) => {
      console.error('fetchFlavorsForStore error', err);
      setFlavorsError('Erro ao buscar sabores. Veja o console para mais detalhes.');
    });
  };

  const addToCart = (product, quantity, store, flavors = []) => {
    setCart((prev) => {
      const storeValue = store && typeof store === 'object' ? store.key || store.name : store;
      const flavorsKey = JSON.stringify(flavors || []);
      const exists = prev.find((item) => item.id === product.id && item.store === storeValue && JSON.stringify(item.flavors || []) === flavorsKey);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id && item.store === storeValue && JSON.stringify(item.flavors || []) === flavorsKey
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      const newItem = { ...product, quantity };
      if (storeValue) newItem.store = storeValue;
      if (flavors && flavors.length) newItem.flavors = flavors;
      return [...prev, newItem];
    });

    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    setToast({ visible: true, message: `${quantity}x ${product.name} adicionado ao carrinho` });
    setTimeout(() => setToast({ visible: false, message: '' }), 2800);
  };

  const handleAdd = (product) => {
    const quantity = quantities[product.id];
    if (!quantity) return;

    const isPote = product.id === 'pote' || (product.name && product.name.toLowerCase().includes('pote'));
    if (isPote) {
      setPendingPote({ product, quantity });
      setSelectedStore('');
      setShowStoreSelector(true);
      return;
    }

    addToCart(product, quantity);
  };

  // remove a cart item by its index (supports duplicates with different flavors/stores)
  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const whatsappText = useMemo(() => {
    if (!cart.length) return '';

    const customerLines = [];
    if (customer.name) customerLines.push(`Nome: ${customer.name}`);
    if (customer.phone) customerLines.push(`Telefone: ${customer.phone}`);
    if (customer.cep) customerLines.push(`CEP: ${customer.cep}`);
    const header = customerLines.length
      ? `Cliente:\n${customerLines.join('\n')}\n\n`
      : '';

    const itemsText = cart
      .map((item, i) => {
        const storeText = item.store ? `\n   Local: ${item.store}` : '';
        const flavorText = item.flavors && item.flavors.length ? `\n   Sabores: ${item.flavors.join(', ')}` : '';
        return `${i + 1}. ${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)} (Subtotal: R$ ${(item.price * item.quantity).toFixed(2)})${storeText}${flavorText}`;
      })
      .join('\n');

    return `Olá! Gostaria de fazer o seguinte pedido:\n\n${header}Itens:\n${itemsText}\n\nTotal: R$ ${total.toFixed(2)}`;
  }, [cart, total, customer.name, customer.phone, customer.cep]);

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  const canSend = Boolean(
    cart.length && customer.name.trim() && customer.phone.trim() && customer.cep.trim(),
  );

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


                </div>
                {/* Mobile-friendly quantity controls (shown via CSS on small screens) */}
                <div className="mobile-qty">
                  <div className="qty-control" aria-hidden={false}>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Diminuir quantidade de ${product.name}`}
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)
                      }
                    >
                      −
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="qty-input"
                      value={quantities[product.id] ?? 0}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                      aria-label={`Quantidade de ${product.name}`}
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Aumentar quantidade de ${product.name}`}
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="produto-btn mobile-add"
                    onClick={() => handleAdd(product)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              

            </div>
          ))}
        </form>

        {/* Store selector for Pote 480ml */}
        {showStoreSelector && pendingPote && (
          <div className="store-selector">
            <h4 className="title-h3">Escolha uma loja para descobrir os sabores</h4>
            <div className="store-options">
                {STORES.map((s) => (
                <label key={s.key} className="store-option">
                  <input
                    type="radio"
                    name="store"
                    value={s.key}
                    checked={selectedStore === s.key}
                    onChange={() => handleSelectStore(s.key)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
              <div className="store-actions">
                <button
                  type="button"
                  className="produto-btn produto-btn"
                  onClick={() => { setShowStoreSelector(false); setPendingPote(null); }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="produto-btn"
                  onClick={handleFetchFlavorsClick}
                  disabled={!selectedStore}
                >
                  Próximo: escolher sabores
                </button>
              </div>
          </div>
        )}

        {/* Flavor selector (shown after a store is chosen) */}
        {showFlavorSelector && pendingPote && (
          <div className="flavor-selector">
            <h4 className="title-h3">Escolha 1 ou 2 sabores ({selectedFlavors.length}/2)</h4>
            {flavorsLoading ? (
              <p>Carregando sabores...</p>
            ) : flavorsError ? (
              <p className="text">{flavorsError}</p>
            ) : (
              <div className="flavor-list">
                {flavorOptions.map((f, i) => (
                  <label key={i} className={`flavor-item ${selectedFlavors.includes(f) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedFlavors.includes(f)}
                      onChange={() => {
                        setSelectedFlavors((prev) => {
                          const has = prev.includes(f);
                          if (has) return prev.filter((x) => x !== f);
                          if (prev.length >= 2) return prev;
                          return [...prev, f];
                        });
                      }}
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="store-actions">
              <button type="button" className="produto-btn produto-btn--disabled" onClick={() => { setShowFlavorSelector(false); setShowStoreSelector(true); }}>
                Voltar
              </button>
              <button
                type="button"
                className="produto-btn"
                onClick={() => {
                  if (selectedFlavors.length < 1) return;
                  // add to cart with selected flavors and store
                  addToCart(pendingPote.product, pendingPote.quantity, selectedStore, selectedFlavors);
                  setPendingPote(null);
                  setShowFlavorSelector(false);
                  setSelectedFlavors([]);
                }}
                disabled={selectedFlavors.length < 1}
              >
                Confirmar sabores
              </button>
            </div>
          </div>
        )}

        <div className="cart">
          <h3 className="title-h3">Seu carrinho</h3>
          {!cart.length ? (
            <p className="text">Nenhum item adicionado ainda.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item, idx) => (
                  <li key={`${item.id}-${idx}`} className="cart-item">
                    <span>
                      {item.quantity}x {item.name}
                      {item.store ? <><br /><small>Local: {item.store}</small></> : null}
                      {item.flavors ? <><br /><small>Sabores: {item.flavors.join(', ')}</small></> : null}
                    </span>
                    <span>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="produto-btn remove-btn"
                      onClick={() => handleRemove(idx)}
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
        {/* Customer info fields */}
        <div className="customer-form">
          <h4 className="title-h3">Seus dados</h4>
          <div className="form-row">
            <input
              required
              type="text"
              className="form-field"
              placeholder="Nome"
              value={customer.name}
              onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              required
              type="text"
              className="form-field"
              placeholder="Telefone"
              value={customer.phone}
              onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
            />
            <input
              required
              type="text"
              className="form-field"
              placeholder="CEP"
              value={customer.cep}
              onChange={(e) => setCustomer((p) => ({ ...p, cep: e.target.value }))}
            />
          </div>
        </div>

        

        {canSend ? (
          <a
            className="produto-btn"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Enviar pedido pelo WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="produto-btn produto-btn--disabled"
            disabled
            aria-disabled="true"
          >
            Enviar pedido pelo WhatsApp
          </button>
        )}

        {!canSend && (
          <p className="text">Preencha Nome, Telefone e CEP e adicione itens ao carrinho para enviar.</p>
        )}

        {/* Toast notification */}
        <div
          className={`toast ${toast.visible ? 'show' : ''}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>

      </div>
    </>
  );
}

export default App;
