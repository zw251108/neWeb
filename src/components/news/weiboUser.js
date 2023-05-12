function WeiboUser({item}){
	return (<div className="module news">
		<div dangerouslySetInnerHTML={{__html: `<wb-follow-account data:uid="${item.uid}">在微博上关注我</wb-follow-account>`}}></div>
	</div>);
}

export default WeiboUser;