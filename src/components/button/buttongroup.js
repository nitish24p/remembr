import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';

export default class ButtonGroup extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={style.buttonGroup}> {children}</div>
    );
  }
}