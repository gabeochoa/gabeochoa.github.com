"use strict";

class Hero extends ReactDOM.Component {

    render() {
        const _style = {};
        if (this.props.backgroundImage) {
            _style.backgroundImage = 'url(${this.props.backgroundImage})';
        }
        return (
            <div {... this.props} style={_style}>
                { this.props.children }
            <div>
        );
    }
};

class Page extends ReactDOM.Component {
        
    render() {
        return (
        <Hero backgroundImage="img/hero-bg-01.jpg">
            <h1 className="display-4"> Declarative Landing Pages for React.js </h1>
            <p className="lead">Build a beautiful landing page in less than an hour.
                   No more redundant code. Easily extensible.</p>
        </Hero>
        );
    }
};

ReactDOM.render(React.createElement(Page), mountNode);//, document.getElementById("container"));