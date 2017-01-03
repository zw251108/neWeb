import React from 'react';

// 示例 1
var Hello = React.createClass({
	render: function(){
		return <div>Hello {this.props.name}</div>;
	}
});

React.render(<Hello name="World" />, document.getElementById('target1'));

// 示例 2
var Timer = React.createClass({
	getInitialState: function(){
		return {secondsElapsed: 0};
	},
	tick: function(){
		this.setState({secondsElapsed: this.state.secondsElapsed + 1});
	},
	componentDidMount: function(){
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function(){
		clearInterval(this.interval);
	},
	render: function(){
		return (
			<div>Seconds Elapsed: {this.state.secondsElapsed}</div>
		);
	}
});

React.render(<Timer />, document.getElementById('target2'));

// 示例 3
var LikeButton = React.createClass({
	getInitialState: function(){
		return {liked: false};
	},
	handleClick: function(event){
		this.setState({liked: !this.state.liked});
	},
	render: function(){
		var text = this.state.liked ? 'like' : 'haven\'t liked';
		return (
			<p onClick={this.handleClick}>
				You {text} this. Click to toggle.
			</p>
		);
	}
});

React.render(
	<LikeButton />,
	document.getElementById('target3')
);

// 示例 4
var Test = React.createClass({
	getInitialState(){
		return {
			value:'xasdasdf'
		};
	},
	onChange(e){
		this.setState({
			value:e.target.value
		});
	},
	render(){
		return (
			<div>
				<div>{this.state.value}</div>
				<input value={this.state.value} onChange={this.onChange}/>
			</div>
		);
	}
});

React.render(<Test />,document.getElementById('target4'));