class Hero extends React.Component {

  render() {
    const _style = {};
    if (this.props.backgroundImage) {
      _style.backgroundImage = 'url(${this.props.backgroundImage})';
    }
    return (
      <div {... this.props} style={_style}>
        <Container>
          { this.props.children }
        </Container>
      </div>
    );
  }
}

class Page extends React.Component{
    render(){
        return(
        <Hero backgroundImage="img/hero-bg-01.jpg">
            <h1 className="display-4"> Declarative Landing Pages for React.js </h1>
            <p className="lead">Build a beautiful landing page in less than an hour.
                No more redundant code. Easily extensible.</p>
        </Hero>
        );
    }
};

ReactDOM.render(<Page/>, document.getElementById("container"));