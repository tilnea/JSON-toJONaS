import React, { Component } from 'react';
import styles from './button.css';

class Button extends Component {
  render() {
    const { title, onClick } = this.props;

    return (
      <button className={styles.button} onClick={onClick}><span className={styles.title}>{title}</span></button>
    );
  }
}

export default Button;