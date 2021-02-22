import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function GroupItem({ link, name, phase, people, isAuth }) {
  return (
    <div className="collection-item">
      <Link to={link}>{name}</Link>
      <span className="badge" title={people.join("\n")}>
        {`Фаза: ${phase}. Студентов: ${people.length}.`}
        <span>
          {isAuth && (
            <i className="material-icons" style={styles.icon}>
              <Link to={`${link}/edit`}>edit</Link>
            </i>
          )}
        </span>
      </span>
    </div>
  );
}

GroupItem.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const styles = {
  icon: { fontSize: 17, marginLeft: 20 }
};

export default GroupItem;
