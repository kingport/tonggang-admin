import './index.less';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


export default class Card extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    className: PropTypes.string,
    extra: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.bool,
      PropTypes.object,
      PropTypes.array,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array,
    ]),
  };

  render() {
    const {
      title,
      extra,
      children,
      className,
      ...props
    } = this.props;
    const cn = ['card-wrapper'].concat((className || '').split(' '));

    return (
      <div
        className={cn.join(' ')}
        {...props}
      >
        {title ? (
          <div className="card-title">{title}</div>
        ) : null}
        {extra ? (
          <div className="card-extra">{extra}</div>
        ) : null}
        <div className="card-content">
          {children}
        </div>
      </div>
    );
  }
}
