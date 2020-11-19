import { Layout, Page, Spinner } from '@shopify/polaris';
import ResourceImageList from '../components/ResourceImageList';
import axios from 'axios';
import store from 'store-js';

class ProductImages extends React.Component {

  state = {
    productId: '',
    productImages: [],
    loading: true
  };

	render() {
    return (
      <Page title="Product Images List">
        <Layout>
          { this.state.loading && (
            <Spinner accessibilityLabel="Spinner example" color="teal" size="large" />
          ) }
          { ! emptyState && (
            <ResourceImageList images={this.state.productImages}></ResourceImageList>
          ) }
        </Layout>
      </Page>
    );
  }

  async componentDidMount() {
		this.setState( { productId: this.getProductId() }, () => {
			this.getProductImages();
		} );
	}

  getProductImages = async () => {
    this.setState({ loading: true });

    axios({
      url: '/get-product-images',
      method: 'get',
      params: {
        productId: this.state.productId
      }
    })
    .then( res => {
      console.log( res.data );
      this.setState( { productImages: res.data } );
      this.setState({ loading: false });
    });
	}

	getProductId = () => {
    const item = store.get('item');
    return item.id;
  };

}

export default ProductImages;
