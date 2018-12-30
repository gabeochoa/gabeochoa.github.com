import React, { Component } from 'react';
import './normalize.css';
import './App.css';

function NavBar(props){
  // for the buttons basically
  let buttons = [
    {key: "Resume"},
    {key: "About"},
    {key: "Projects"},
  ]
  return (
    <nav>
      <div id="nav-links">
        <p>Gabe Ochoa</p>
        {buttons.map((item, i) => {
          return (<button key={item.key} 
                          name={i}
                         onClick={props.onClick}
                         className={props.selected === i? "underlined" : ""}>
                  {item.key}
                  </button>);
        })
        }
      </div>
      <div>
        <br/>
        <h4>
          Senior Software Eng. @ Bloomberg L.P.
          <br/>
          <sup>Previously CS &amp; Math @ Binghamton University</sup>
        </h4>
      </div>
    </nav>
  );
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      current_tab: 1
    }
  }
  
  render() {
    let body = null;
    switch(this.state.current_tab)
    {
      case 1:
        body = (
          <>
          <h1>About</h1>
          <p style={{textAlign:"left", margin: "2%"}}>hey, i'm Gabe.
            <br/>
             i work at bloomberg on network automation.
             we have the world's largest private network. 
            <br/>
            <br/>
             recently i've been building ugly UIs and beatiful REST APIs for network engineers
            </p>
            <h2>Before that... </h2>
            <p style={{textAlign:"left", margin: "2%"}}>
              i was at binghamton university doing NYT crosswords and going to hackathons.
              worked with a bunch of <a href="http://core.binghamton.edu">cool folks</a>  on some seriously adjective pieces of code 
            </p>
            <h4>Semi-Comprehensive previous location list <small>(3+ months)</small></h4>
          <ul style={{listStyleType:"none", textAlign:"left"}}>
            <li><span role="img" aria-label="apple">🍎</span>Queens, NY</li>
            <li><span role="img" aria-label="tree">🌲</span>"Upstate" New York</li>
            <li><span role="img" aria-label="cow">🐄</span>West Midlands UK </li>
            <li><span role="img" aria-label="palm tree">🌴</span>Miami</li>
            <li><span role="img" aria-label="sun">☀️</span>Belize</li>
            <li><span role="img" aria-label="taco">🌮</span>Mexico</li>
            <li><span role="img" aria-label="camera">🎥</span>LA</li>
            <li><span role="img" aria-label="apple">🍎</span>Queens, NY</li>
          </ul>
          <sup> not sure if ill move i do kinda like the cycle</sup>
          </>
        );
      break;
      default:
        body = null;
        break;
    }
    return (
      <div className="App">
        <header className="App-header">
          <NavBar
            onClick={(event)=>{this.setState({current_tab: parseInt(event.target.getAttribute("name"))})}}
            selected={this.state.current_tab}
          />
        </header>
        <section className="App-content">
          {body}
        </section>
        <footer className="App-footer">
          <h1>Let's get in touch!</h1>
        </footer>
      </div>
    );
  }
}

export default App;
