import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import React, { Children } from "react";
import isEqual from "lodash/isEqual";

const ActiveLink = ({ children, activeClassName, methodGet, ...props }) => {
  const { pathname, query } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || "";
  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as

  const className = (() => {
    if (methodGet) {
      return isEqual(methodGet, query)
        ? `${childClassName} ${activeClassName}`.trim()
        : childClassName;
    } else {
      return pathname === props.href || pathname === props.as
        ? `${childClassName} ${activeClassName}`.trim()
        : childClassName;
    }
  })();

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
};

export default ActiveLink;
