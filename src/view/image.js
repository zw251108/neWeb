import {useState, useEffect} from 'react';

import {imgPath}     from '../config.js';
import api           from '../api/index.js';
import Alert         from '../components/alert/index.js';

function Image({id, albumId}){
	const
		[ img, setImg ] = useState({
			tags: []
		})
		,
		[ h, setH ] = useState(false)
		,
		[ showPrev, setShowPrev ] = useState( !!albumId )
		,
		[ showNext, setShowNext ] = useState( !!albumId )
		,
		[ showAlert, setShowAlert ] = useState(false)
		,
		[ alertContent, setAlertContent ] = useState('')
		;

	function prev(){
		api.get(`/image/${img.id}/prev`, {
			data: {
				albumId
			}
		}).then(({data})=>{
			if( data.length ){
				data = data[0];

				setImg( data );
				setShowNext(true);
				setH( data.width / data.height > 1.3 );
			}
			else{
				setAlertContent('已经是第一张了');
				setShowPrev(false);
				setShowAlert(true);
			}
		});
	}

	function next(){
		api.get(`/image/${img.id}/next`, {
			data: {
				albumId
			}
		}).then(({data})=>{
			if( data.length ){
				data = data[0];

				setImg( data );
				setShowPrev(true);
				setH( data.width / data.height > 1.3 );
			}
			else{                                        console.log(111)
				setAlertContent('已经是最后一张了');
				setShowNext(false);
				setShowAlert(true);
			}
		});
	}

	function alertConfirm(){
		setShowAlert(false);
	}

	useEffect(()=>{
		api.get(`/image/${id}`).then(({data})=>{
			setImg( data );

			setH( data.width / data.height > 1.3 );
		});
	}, [id]);

	return (<article className={`module image ${h ? '' : 'image-v'}`}>
		<div className="module_title">&nbsp;</div>
		<div className="module_content">
			<div className="img_preview">
				<div className="img_main container img">
					<img src={img.src ? imgPath( img.src ) : ''}
					     alt=""/>
					{showPrev ?
						(<div className="prev container flex left justify"
						      onClick={prev}>
							<i className="icon icon-left"></i>
						</div>)
						:
						null}
					{showNext ?
						(<div className="next container flex right justify"
						      onClick={next}>
							<i className="icon icon-right"></i>
						</div>)
						:
						null}
				</div>
			</div>
			<p className="img_desc">{img.desc}</p>
		</div>
		<div className="module_info">
			<div className="module_tags">
				{img.tags.map((name)=>{
					return (<span key={name}
					              className="tag">{name}</span>);
				})}
			</div>
			<div className="module_datetime">{img.createDate}</div>
		</div>
		{showAlert ? (<Alert title="提示" content={alertContent} cb={alertConfirm}></Alert>) : null}
	</article>);
}

export default Image;