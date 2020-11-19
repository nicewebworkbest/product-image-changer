import React from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  Filters,
  TextStyle,
  Thumbnail,
  Pagination
} from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import store from 'store-js';
import { Context } from '@shopify/app-bridge-react';

class ResourceProductList extends React.Component {
  static contextType = Context;

  state = {
    queryValue: ''
  };

  setQueryValue = ( value ) => {
    this.setState( { queryValue: value } );
  }

  handleFiltersQueryChange = ( value ) => {
    this.setQueryValue(value);
  }

  handleQueryValueRemove = () => {
    this.setQueryValue('');
  }

  render() {
    const filters = [];
    const appliedFilters = [];
    const filterControl = (
      <Filters
        queryValue={this.state.queryValue}
        filters={filters}
        appliedFilters={appliedFilters}
        onQueryChange={this.handleFiltersQueryChange}
        onQueryClear={this.handleQueryValueRemove}
      >
      </Filters>
    );

    const app = this.context;
    const redirectToProductImages = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/product-images',
      );
    };

    return (
      <Card>
        <ResourceList
          resourceName={{ singular: 'Product', plural: 'Products' }}
          filterControl={ filterControl }
          items={ this.props.products }
          renderItem={(item) => {
            const media = (
              <Thumbnail
                source={
                  item.imgSrc
                    ? item.imgSrc
                    : ''
                }
                alt=''
              />
            );

            const itemClicked = () => {
              store.set('item', item);
              redirectToProductImages();
            };

            return (
              <ResourceItem
                id={item.id}
                media={media}
                accessibilityLabel={`View details for ${item.title}`}
                onClick={itemClicked}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">
                        {item.title}
                      </TextStyle>
                    </h3>
                  </Stack.Item>
                </Stack>
              </ResourceItem>
            );
          }}
        />
        <Pagination
          hasPrevious={this.props.pageInfo.hasPreviousPage}
          onPrevious={() => {
            this.props.prevPageProduct();
          }}
          hasNext={this.props.pageInfo.hasNextPage}
          onNext={() => {
            this.props.nextPageProduct();
          }}
        />
      </Card>
    );
  }

}

export default ResourceProductList;
