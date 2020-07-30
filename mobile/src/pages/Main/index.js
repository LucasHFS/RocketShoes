import React, { useState, useEffect} from 'react';
import { FlatList } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../store/modules/cart/actions';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import { formatPrice } from '../../util/format';

import {
  Container,
  Product,
  ProductImage,
  ProductTitle,
  ProductPrice,
  AddButton,
  ProductAmount,
  ProductAmountText,
  AddButtonText,
} from './styles';

export default function Main() {
  
  const dispatch = useDispatch();
  const amount = useSelector(state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}));

  const [ products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);


  async function getProducts()  {
    const response = await api.get('/products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    setProducts(data);
  };

  handleAddProduct = id => {
    dispatch(CartActions.addToCartRequest(id));
  };

  renderProduct = ({ item }) => {

    return (
      <Product key={item.id}>
        <ProductImage source={{ uri: item.image }} />
        <ProductTitle>{item.title}</ProductTitle>
        <ProductPrice>{formatPrice(item.price)}</ProductPrice>
        <AddButton onPress={() => this.handleAddProduct(item.id)}>
          <ProductAmount>
              <Icon name="add-shopping-cart" color="#FFF" size={20} /> 
            <ProductAmountText>{amount[item.id] || 0}
            </ProductAmountText>
          </ProductAmount>
          <AddButtonText>ADICIONAR</AddButtonText>
        </AddButton>
      </Product>
    )
  }

    return (
      <Container>
        <FlatList
          horizontal
          data={products}
          extraData={this.props}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderProduct}
        />
      </Container>
    );
}
