import React, { Fragment } from 'react';

const Menu = ({ toggleShowSubGrade, toggleSize }) => (
    <Fragment>
        <div className="toggle">
            <div className="title">
                Grade Type
            </div>
            Grade
            <label className="switch">
                <input type="checkbox" onChange={toggleShowSubGrade}/>
                <span className="slider"></span>
            </label>
            SubGrade
        </div>
        <div className="toggle">
            <div className="title">
                Graph Size
            </div>
            Small
            <label className="switch">
                <input type="checkbox" onChange={toggleSize}/>
                <span className="slider"></span>
            </label>
            Large
        </div>
    </Fragment>
);

export default Menu;