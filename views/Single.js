import React from 'react';
import {StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem, Icon} from '@rneui/themed';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: t} = route.params;
  return (
    <Card>
      <Image style={styles.image} source={{uri: uploadsUrl + filename}} />
      <ListItem>
        <ListItem.Title>{title}</ListItem.Title>
      </ListItem>
      <ListItem containerStyle={styles.description}>
        <Icon name="image"></Icon>
        <ListItem.Subtitle>{description}</ListItem.Subtitle>
      </ListItem>
      <ListItem>
        <ListItem.Subtitle>
          Added At: {new Date(t).toLocaleString('fi-FI')}
        </ListItem.Subtitle>
      </ListItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
  },
  description: {
    width: 350,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
