import React, { useState, useEffect} from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import api from '../../services/api';
import { formatPrice } from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';
import { ProductList } from './styles';

function Home() {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    const amount = useSelector(state => state.cart.reduce((amount, product) => {
        amount[product.id] = product.amount;
        return amount;
    },{})
    );

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const response = await api.get('products');
        const data = response.data.map(product => ({
            ...product,
            priceFormatted: formatPrice(product.price),
        }));
        setProducts(data)
    }

    const handleAddProduct = id => {
        dispatch(CartActions.addToCartRequest(id));
    }

    return (
        <ProductList>
            {products.map(product => (

            <li key={product.id}>
                <img src={product.image} alt={product.title} />

                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>

                <button type="button" onClick={() => handleAddProduct(product.id)}>
                    <div>
                        <MdAddShoppingCart size={16} color="#fff"/> { amount[product.id] || 0 }
                    </div>

                    <span>ADICIONAR AO CARRINHO</span>
                </button>
            </li>
            ))}
        </ProductList>
    )
}

export default Home;