import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';

export default class FixedButton extends Component {
  render() {
    const { label, disabled, onClick } = this.props;
    return (
      <button className={style.fixedBtn}
        disabled={disabled} onClick={onClick}
      > {label}</button>
    );
  }
}