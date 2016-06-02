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
        return <h1>hello</h1>;
    }
};

ReactDOM.render(<Page/>, document.getElementById("container"));

/*
return (
        <Hero backgroundImage="img/hero-bg-01.jpg">
            <h1 className="display-4"> Declarative Landing Pages for React.js </h1>
            <p className="lead">Build a beautiful landing page in less than an hour.
                   No more redundant code. Easily extensible.</p>
        </Hero>
        );
        */