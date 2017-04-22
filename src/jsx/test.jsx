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



var Comment = React.createClass({
	render: function () {
		return (
			<div className="col-md-12 comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<p>{this.props.children.toString()}</p>
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function () {
		var commentNodes = this.props.data.map(function (comment) {
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="col-md-8 commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	getInitialState() {
		return {
			name: '',
			text: ''
		}
	},
	updateField(field, e) {
		var state = {};
		state[field] = e.target.value;
		this.setState(state);
	},
	handleSubmit(e){
		e.preventDefault();
		this.props.onPost({
			author:this.state.name,
			text:this.state.text
		});
		this.setState({
			name:'',
			text:''
		});
	},
	render: function () {
		return (
			<div className="col-md-4">
				<form className="commentForm" onSubmit={this.handleSubmit}>
					<div class="form-group">
						<label for="name">用户名</label>
						<input id="name" className="form-control" placeholder="Your name" value={this.state.name} onChange={this.updateField.bind(this, 'name')}/>
					</div>
					<div class="form-group">
						<label for="comment">评论</label>
						<input id="comment" className="form-control" placeholder="Say something..."
						       value={this.state.text} onChange={this.updateField.bind(this, 'text')}
						/>
					</div>
					<input type="submit" className="btn btn-default" value="Post" />
				</form>
			</div>);
	}
});

var database = [
	{
		author: '作者 1',
		text: '评论 1,' + Date.now()
	},
	{
		author: '作者 2',
		text: ' *评论 2,' + Date.now() + '* '
	}
];

var CommentBox = React.createClass({
	loadCommentsFromServer: function () {
		var self = this;

		// todo 发送 ajax 获取评论
		//$.ajax({
		//  url: this.props.url,
		//  method:'post',
		//  dataType:'json',
		//  data: {
		//    json:JSON.stringify({
		//      data:database
		//    })
		//  },
		//  success(res) {
		//    self.setState({data: res.data})
		//  }
		//});

		//this.state.data.push.apply(this.state.data, database);
		self.setState({
			data: this.props.data.concat( database )
		})
	},
	getInitialState: function () {
		return {
			data: this.props.data.concat( database )
		};
	},
	handlePost(post){
		database.push(post);
		this.loadCommentsFromServer();
	},
	componentDidMount: function () {
		this.loadCommentsFromServer();
	},
	render: function () {
		return (
			<div className="row commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onPost={this.handlePost}/>
			</div>
		);
	}
});

var dataset = [{
	author: '作者 0'
	, text: '评论 0' + Date.now() + '* '
}];

React.render(
	<CommentBox url="/echo/json/" data={dataset} />,
	document.getElementById('container')
);