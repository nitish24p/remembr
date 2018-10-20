import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';

export default class Button extends Component {
  render() {
    const { label, disabled, onClick, secondary, primary, tertiary } = this.props;
    return (
      <button className={`${style.fixedBtn} 
        ${secondary ? style.secondary: ''}
        ${primary ? style.primary : ''}
        ${tertiary ? style.tertiary : ''}
      `}
        disabled={disabled} onClick={onClick}
      > {label}</button>
    );
  }
}