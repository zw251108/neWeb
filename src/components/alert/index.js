function Alert({title, content, cb}){
	return (<div className="modal">
		<div className="module alert">
			<div className="module_title">{title}</div>
			<div className="module_content">
				<div className="alert_content">{content}</div>
			</div>
			<div className="alert_op">
				<button className="btn" onClick={cb}>确定</button>
			</div>
		</div>
	</div>);
}

export default Alert;