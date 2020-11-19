import { TextField, Layout, Page, Spinner } from '@shopify/polaris';
import ResourceProductList from '../components/ResourceProductList';
import axios from 'axios';

class Index extends React.Component {

  state = {
    searchProductText: "",
    nextCursor: "",
    beforeCursor: "",
    products: [],
    pageInfo: [],
    loading: true
  };

	render() {
    const emptyState = ( this.state.products == null ) || (this.state.products.length == 0 );
    return (
      <Page title="Product Lists">
          <TextField label="Search Products" placeholder="Product title" class="aaa" value={this.state.searchProductText} onChange={this.handleSearchProductTextChange} />
          <Layout>
            { this.state.loading && (
              <Spinner accessibilityLabel="Spinner example" color="teal" size="large" />
            ) }
            { ! emptyState && (
              <ResourceProductList products={this.state.products} pageInfo={this.state.pageInfo} prevPageProduct={this.prevPageProduct} nextPageProduct={this.nextPageProduct}></ResourceProductList>
            ) }
          </Layout>
      </Page>
    );
  }

  async componentDidMount() {
    this.searchProducts( "", "" );
  }

  handleSearchProductTextChange = (value) => {
    console.log(value);
    this.setState({ loading: true });
    this.setState({searchProductText: value}, () => {
      this.searchProducts( "", "" );
    });
  }

  searchProducts = async (beforeAfter, cursor) => {
    this.setState({ loading: true });

    axios({
      url: '/get-products',
      method: 'get',
      params: {
        searchProductText: this.state.searchProductText,
        beforeAfter: beforeAfter,
        cursor: cursor
      }
    })
    .then( res => {
      this.setState({products: res.data.products});
      this.setState({pageInfo: res.data.pageInfo});
      this.setState({beforeCursor: res.data.pageInfo.beforeCursor});
      this.setState({afterCursor: res.data.pageInfo.afterCursor});
      this.setState({ loading: false });
    });
  }

  nextPageProduct = () => {
    this.searchProducts( "after", this.state.afterCursor );
  }

  prevPageProduct = () => {
    this.searchProducts( "before", this.state.beforeCursor );
  }

}

export default Index;
